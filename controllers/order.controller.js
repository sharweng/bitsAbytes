const connection = require("../config/database")

const createOrder = (req, res) => {
  const { items, shipping_address } = req.body
  const user_id = req.user.id

  console.log("Creating order for user:", user_id)
  console.log("Order items:", items)
  console.log("Shipping address:", shipping_address)

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order items are required and must be a non-empty array",
    })
  }

  // Validate each item
  for (const item of items) {
    if (!item.product_id || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Each item must have a valid product_id and quantity greater than 0",
      })
    }
  }

  // Start transaction
  connection.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err)
      return res.status(500).json({
        success: false,
        message: "Error starting database transaction",
        error: err.message,
      })
    }

    // First, check if products exist and get their types
    const productIds = items.map((item) => item.product_id)
    const checkProductsSql = `
    SELECT p.product_id, p.title, p.ptype_id, pt.description as product_type, s.quantity as stock_quantity
    FROM products p
    JOIN product_types pt ON p.ptype_id = pt.ptype_id
    LEFT JOIN stock s ON p.product_id = s.product_id
    WHERE p.product_id IN (${productIds.map(() => "?").join(",")})
  `

    connection.execute(checkProductsSql, productIds, (err, products) => {
      if (err) {
        return connection.rollback(() => {
          console.error("Product check error:", err)
          res.status(500).json({
            success: false,
            message: "Error checking product availability",
            error: err.message,
          })
        })
      }

      if (products.length !== items.length) {
        const foundIds = products.map((p) => p.product_id)
        const missingIds = productIds.filter((id) => !foundIds.includes(id))
        return connection.rollback(() => {
          res.status(400).json({
            success: false,
            message: `Products not found: ${missingIds.join(", ")}`,
          })
        })
      }

      // Check if physical products need shipping address (frontend handles this, but backend can validate)
      const physicalProducts = products.filter((p) => p.product_type === "physical")
      if (physicalProducts.length > 0 && !shipping_address) {
        // This check is still valid, even if we don't store it on the order itself
        // The frontend should enforce this before calling the API
        console.warn(
          "Physical products in order but no shipping address provided. This address will not be stored with the order.",
        )
      }

      // Create order - REMOVE shipping_address from INSERT
      const orderSql = "INSERT INTO orders (user_id, stat_id) VALUES (?, 1)"
      connection.execute(orderSql, [user_id], (err, orderResult) => {
        if (err) {
          return connection.rollback(() => {
            console.error("Order creation error:", err)
            res.status(500).json({
              success: false,
              message: "Error creating order record",
              error: err.message,
            })
          })
        }

        const orderId = orderResult.insertId
        console.log("Order created with ID:", orderId)

        let completedItems = 0
        let hasError = false

        // Process each item
        items.forEach((item) => {
          const product = products.find((p) => p.product_id === item.product_id)

          // Insert order item
          const orderItemSql = "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)"
          connection.execute(orderItemSql, [orderId, item.product_id, item.quantity], (err) => {
            if (err) {
              hasError = true
              return connection.rollback(() => {
                console.error("Order item creation error:", err)
                res.status(500).json({
                  success: false,
                  message: `Error adding "${product.title}" to order`,
                  error: err.message,
                })
              })
            }

            // Update stock only for physical products
            if (product.product_type === "physical") {
              const updateStockSql = "UPDATE stock SET quantity = quantity - ? WHERE product_id = ?"
              connection.execute(updateStockSql, [item.quantity, item.product_id], (err) => {
                if (err) {
                  hasError = true
                  return connection.rollback(() => {
                    console.error("Stock update error:", err)
                    res.status(500).json({
                      success: false,
                      message: `Error updating stock for "${product.title}"`,
                      error: err.message,
                    })
                  })
                }

                completedItems++
                if (completedItems === items.length && !hasError) {
                  commitTransaction()
                }
              })
            } else {
              // Digital product, no stock update needed
              completedItems++
              if (completedItems === items.length && !hasError) {
                commitTransaction()
              }
            }
          })
        })

        function commitTransaction() {
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Transaction commit error:", err)
                res.status(500).json({
                  success: false,
                  message: "Error finalizing order",
                  error: err.message,
                })
              })
            }

            console.log("Order completed successfully:", orderId)
            res.status(201).json({
              success: true,
              message: "Order created successfully",
              order_id: orderId,
            })
          })
        }
      })
    })
  })
}

const getUserOrders = (req, res) => {
  const user_id = req.user.id

  const sql = `
  SELECT 
    o.order_id,
    u.shipping_address, -- Changed from o.shipping_address
    o.order_date,
    o.shipped_date,
    o.delivered_date,
    s.description as status,
    COUNT(oi.product_id) as total_items,
    SUM(p.price * oi.quantity) as total_amount
  FROM orders o
  JOIN status s ON o.stat_id = s.stat_id
  LEFT JOIN order_items oi ON o.order_id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.product_id
  JOIN users u ON o.user_id = u.user_id -- Ensure user join for shipping_address
  WHERE o.user_id = ?
  GROUP BY o.order_id
  ORDER BY o.order_date DESC
`

  try {
    connection.execute(sql, [user_id], (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching orders",
          error: err.message,
        })
      }

      return res.status(200).json({
        success: true,
        orders: results,
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getOrderDetails = (req, res) => {
  const orderId = req.params.id
  const user_id = req.user.id

  // Get order info
  const orderSql = `
  SELECT 
    o.*,
    s.description as status,
    u.first_name,
    u.last_name,
    u.email,
    u.shipping_address as user_shipping_address -- Changed from o.shipping_address
  FROM orders o
  JOIN status s ON o.stat_id = s.stat_id
  JOIN users u ON o.user_id = u.user_id
  WHERE o.order_id = ? AND o.user_id = ?
`

  // Get order items
  const itemsSql = `
  SELECT 
    oi.*,
    p.title,
    p.price,
    p.description,
    pt.description as product_type,
    pi.image_url
  FROM order_items oi
  JOIN products p ON oi.product_id = p.product_id
  JOIN product_types pt ON p.ptype_id = pt.ptype_id
  LEFT JOIN product_images pi ON p.product_id = pi.product_id
  WHERE oi.order_id = ?
  GROUP BY oi.product_id
`

  try {
    connection.execute(orderSql, [orderId], (err, orderResult) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching order",
          error: err.message,
        })
      }

      if (orderResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      connection.execute(itemsSql, [orderId], (err, itemsResult) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success: false,
            message: "Error fetching order items",
            error: err.message,
          })
        }

        const order = orderResult[0]
        order.items = itemsResult

        return res.status(200).json({
          success: true,
          order: order,
        })
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

// Admin functions
const getAllOrders = (req, res) => {
  const { status_filter, date_from, date_to } = req.query

  let whereClause = ""
  const params = []

  if (status_filter) {
    whereClause += "WHERE o.stat_id = ?"
    params.push(status_filter)
  }

  if (date_from) {
    whereClause += whereClause ? " AND DATE(o.order_date) >= ?" : "WHERE DATE(o.order_date) >= ?"
    params.push(date_from)
  }

  if (date_to) {
    whereClause += whereClause ? " AND DATE(o.order_date) <= ?" : "WHERE DATE(o.order_date) <= ?"
    params.push(date_to)
  }

  const sql = `
  SELECT 
    o.order_id,
    o.user_id,
    u.shipping_address as user_shipping_address, -- Changed from o.shipping_address
    o.order_date,
    o.shipped_date,
    o.delivered_date,
    s.description as status,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(oi.product_id) as total_items,
    SUM(p.price * oi.quantity) as total_amount
  FROM orders o
  JOIN status s ON o.stat_id = s.stat_id
  JOIN users u ON o.user_id = u.user_id
  LEFT JOIN order_items oi ON o.order_id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.product_id
  ${whereClause}
  GROUP BY o.order_id
  ORDER BY o.order_date DESC
`

  try {
    connection.execute(sql, params, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching orders",
          error: err.message,
        })
      }

      return res.status(200).json({
        success: true,
        orders: results,
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const getOrderDetailsAdmin = (req, res) => {
  const orderId = req.params.id

  // Get order info
  const orderSql = `
  SELECT 
    o.*,
    s.description as status,
    u.first_name,
    u.last_name,
    u.email,
    u.shipping_address as user_shipping_address -- Changed from o.shipping_address
  FROM orders o
  JOIN status s ON o.stat_id = s.stat_id
  JOIN users u ON o.user_id = u.user_id
  WHERE o.order_id = ?
`

  // Get order items
  const itemsSql = `
  SELECT 
    oi.*,
    p.title,
    p.price,
    p.description,
    pt.description as product_type,
    pi.image_url
  FROM order_items oi
  JOIN products p ON oi.product_id = p.product_id
  JOIN product_types pt ON p.ptype_id = pt.ptype_id
  LEFT JOIN product_images pi ON p.product_id = pi.product_id
  WHERE oi.order_id = ?
  GROUP BY oi.product_id
`

  try {
    connection.execute(orderSql, [orderId], (err, orderResult) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching order",
          error: err.message,
        })
      }

      if (orderResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        })
      }

      connection.execute(itemsSql, [orderId], (err, itemsResult) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            success: false,
            message: "Error fetching order items",
            error: err.message,
          })
        }

        const order = orderResult[0]
        order.items = itemsResult

        return res.status(200).json({
          success: true,
          order: order,
        })
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

const updateOrderStatus = (req, res) => {
  const orderId = req.params.id
  const { shipped_date, delivered_date, stat_id } = req.body

  let finalStatId = stat_id // Start with the provided stat_id from frontend
  let finalShippedDate = shipped_date === undefined ? null : shipped_date
  let finalDeliveredDate = delivered_date === undefined ? null : delivered_date

  // Logic for clearing dates based on requested status (Pending, Cancelled)
  // If status is Pending (1) or Cancelled (5), clear dates.
  // Processing (2) should allow dates to be set.
  if (finalStatId === 1 || finalStatId === 5) {
    finalShippedDate = null
    finalDeliveredDate = null
  }

  // Logic for setting status based on dates (Shipped, Delivered)
  // These override the stat_id if dates are provided.
  // This should happen *after* any date clearing based on status.
  if (finalDeliveredDate !== null) {
    finalStatId = 4 // Delivered
  } else if (finalShippedDate !== null) {
    finalStatId = 3 // Shipped
  }

  const updateFields = []
  const params = []

  updateFields.push("stat_id = ?")
  params.push(finalStatId)

  updateFields.push("shipped_date = ?")
  params.push(finalShippedDate)

  updateFields.push("delivered_date = ?")
  params.push(finalDeliveredDate)

  if (updateFields.length === 0) {
    return res.status(400).json({ success: false, message: "No fields to update" })
  }

  const sql = `UPDATE orders SET ${updateFields.join(", ")} WHERE order_id = ?`
  params.push(orderId)

  try {
    connection.execute(sql, params, (err, result) => {
      if (err) {
        console.error("Error updating order:", err)
        return res.status(500).json({ success: false, message: "Error updating order", error: err.message })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Order not found" })
      }

      return res.status(200).json({ success: true, message: "Order updated successfully" })
    })
  } catch (error) {
    console.error("Server error:", error)
    return res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

const deleteOrder = (req, res) => {
  const orderId = req.params.id

  // Start transaction to restore stock
  connection.beginTransaction((err) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error starting transaction",
        error: err.message,
      })
    }

    // Get order items to restore stock (only for physical products)
    const getItemsSql = `
    SELECT oi.product_id, oi.quantity, pt.description as product_type
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    JOIN product_types pt ON p.ptype_id = pt.ptype_id
    WHERE oi.order_id = ?
  `

    connection.execute(getItemsSql, [orderId], (err, items) => {
      if (err) {
        return connection.rollback(() => {
          console.log(err)
          res.status(500).json({
            success: false,
            message: "Error fetching order items",
            error: err.message,
          })
        })
      }

      const physicalItems = items.filter((item) => item.product_type === "physical")
      let completedUpdates = 0
      let hasError = false

      if (physicalItems.length === 0) {
        // No physical items to restore, just delete the order
        deleteOrderRecord()
        return
      }

      // Restore stock for physical items only
      physicalItems.forEach((item) => {
        const updateStockSql = "UPDATE stock SET quantity = quantity + ? WHERE product_id = ?"
        connection.execute(updateStockSql, [item.quantity, item.product_id], (err) => {
          if (err) {
            hasError = true
            return connection.rollback(() => {
              res.status(500).json({
                success: false,
                message: "Error restoring stock",
                error: err.message,
              })
            })
          }

          completedUpdates++
          if (completedUpdates === physicalItems.length && !hasError) {
            deleteOrderRecord()
          }
        })
      })

      function deleteOrderRecord() {
        const deleteOrderSql = "DELETE FROM orders WHERE order_id = ?"
        connection.execute(deleteOrderSql, [orderId], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.log(err)
              res.status(500).json({
                success: false,
                message: "Error deleting order",
                error: err.message,
              })
            })
          }

          if (result.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({
                success: false,
                message: "Order not found",
              })
            })
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({
                  success: false,
                  message: "Error committing transaction",
                  error: err.message,
                })
              })
            }

            res.status(200).json({
              success: true,
              message: "Order deleted successfully and stock restored",
            })
          })
        })
      }
    })
  })
}

const getOrderStatuses = (req, res) => {
  const sql = "SELECT stat_id, description FROM status ORDER BY stat_id"

  connection.execute(sql, [], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error fetching order statuses",
        error: err.message,
      })
    }

    return res.status(200).json({
      success: true,
      statuses: results,
    })
  })
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  getOrderDetailsAdmin,
  updateOrderStatus,
  deleteOrder,
  getOrderStatuses,
}
