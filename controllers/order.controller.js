const connection = require("../config/database")

// Add these imports at the top of the file
const sendEmail = require("../utils/email")
const generatePdf = require("../utils/pdfGenerator")

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
  SELECT p.product_id, p.title, p.price, p.ptype_id, pt.description as product_type, s.quantity as stock_quantity, pi.image_url
  FROM products p
  JOIN product_types pt ON p.ptype_id = pt.ptype_id
  LEFT JOIN stock s ON p.product_id = s.product_id
  LEFT JOIN product_images pi ON p.product_id = pi.product_id
  WHERE p.product_id IN (${productIds.map(() => "?").join(",")})
  GROUP BY p.product_id
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

        async function commitTransaction() {
          connection.commit(async (err) => {
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

            // --- Email Sending Logic for New Order ---
            try {
              // Fetch user details and the newly created order details for the email
              const getOrderAndUserDetailsSql = `
                SELECT
                  o.order_id, o.order_date, o.stat_id,
                  s.description as status_description,
                  u.email, u.first_name, u.last_name, u.shipping_address,
                  oi.product_id, oi.quantity,
                  p.title, p.price,
                  pt.description as product_type,
                  pi.image_url
                FROM orders o
                JOIN status s ON o.stat_id = s.stat_id
                JOIN users u ON o.user_id = u.user_id
                LEFT JOIN order_items oi ON o.order_id = oi.order_id
                LEFT JOIN products p ON oi.product_id = p.product_id
                LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
                LEFT JOIN product_images pi ON p.product_id = pi.product_id
                WHERE o.order_id = ?
              `
              const [orderAndUserDetails] = await connection.promise().execute(getOrderAndUserDetailsSql, [orderId])

              if (orderAndUserDetails.length > 0) {
                const orderDetails = {
                  order_id: orderAndUserDetails[0].order_id,
                  order_date: orderAndUserDetails[0].order_date,
                  stat_id: orderAndUserDetails[0].stat_id,
                  status_description: orderAndUserDetails[0].status_description,
                  email: orderAndUserDetails[0].email,
                  first_name: orderAndUserDetails[0].first_name,
                  last_name: orderAndUserDetails[0].last_name,
                  shipping_address: orderAndUserDetails[0].shipping_address,
                  items: orderAndUserDetails[0].product_id
                    ? orderAndUserDetails.map((row) => ({
                        product_id: row.product_id,
                        quantity: row.quantity,
                        title: row.title,
                        price: row.price,
                        product_type: row.product_type,
                        image_url: row.image_url,
                      }))
                    : [],
                }

                const orderDate = new Date(orderDetails.order_date).toLocaleDateString()
                const totalAmount = orderDetails.items.reduce(
                  (sum, item) => sum + Number(item.price) * item.quantity,
                  0,
                )

                const emailHtml = `
                  <p>Dear ${orderDetails.first_name} ${orderDetails.last_name},</p>
                  <p>Thank you for your order from Bits & Bytes!</p>
                  <p>Your order #${orderDetails.order_id} has been successfully placed and is currently <strong>${orderDetails.status_description}</strong>.</p>
                  <p><strong>Order Date:</strong> ${orderDate}</p>
                  <p>You can track your order in the "My Orders" section of your account.</p>
                  <p>A detailed receipt is attached to this email.</p>
                  <p>We appreciate your business!</p>
                `

                const pdfHtml = `
                  <h1 style="text-align: center; color: #333;">Order Receipt - Bits & Bytes</h1>
                  <hr style="border: 1px solid #eee; margin-bottom: 20px;">
                  <p><strong>Order ID:</strong> #${orderDetails.order_id}</p>
                  <p><strong>Order Date:</strong> ${orderDate}</p>
                  <p><strong>Current Status:</strong> <span style="text-transform: capitalize;">${orderDetails.status_description}</span></p>
                  <br>
                  <p><strong>Customer Name:</strong> ${orderDetails.first_name} ${orderDetails.last_name}</p>
                  <p><strong>Customer Email:</strong> ${orderDetails.email}</p>
                  ${orderDetails.shipping_address ? `<p><strong>Shipping Address:</strong> ${orderDetails.shipping_address}</p>` : ""}
                  <br>
                  <h2 style="color: #333;">Order Items:</h2>
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                      <tr style="background-color: #f2f2f2;">
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Type</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
                        <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderDetails.items
                        .map(
                          (item) => `
                        <tr>
                          <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                          <td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;">${item.product_type}</td>
                          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${Number(item.price).toFixed(2)}</td>
                          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${(Number(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                      `,
                        )
                        .join("")}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total Amount:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                  <p style="text-align: center; font-size: 12px; color: #777;">Thank you for your purchase!</p>
                `

                const pdfBuffer = await generatePdf(pdfHtml)

                await sendEmail({
                  email: orderDetails.email,
                  subject: `Your Bits & Bytes Order #${orderDetails.order_id} Confirmation`,
                  html: emailHtml,
                  attachments: [
                    {
                      filename: `receipt_order_${orderDetails.order_id}.pdf`,
                      content: pdfBuffer,
                      contentType: "application/pdf",
                    },
                  ],
                })
              }
            } catch (emailError) {
              console.error("Failed to send new order confirmation email:", emailError)
              // Do not rollback the transaction here, as the order creation was successful.
              // Just log the email error.
            }
            // --- End Email Sending Logic ---

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
  const { status_filter } = req.query // Get status_filter from query parameters

  let whereClause = "WHERE o.user_id = ?"
  const params = [user_id]

  if (status_filter) {
    whereClause += " AND o.stat_id = ?"
    params.push(status_filter)
  }

  const sql = `
SELECT 
  o.order_id,
  u.shipping_address,
  o.order_date,
  o.shipped_date,
  o.delivered_date,
  s.description as status,
  COUNT(DISTINCT oi.product_id) as total_items,
  SUM(p.price * oi.quantity) as total_amount,
  GROUP_CONCAT(DISTINCT pt.description) as product_types_in_order
FROM orders o
JOIN status s ON o.stat_id = s.stat_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
JOIN users u ON o.user_id = u.user_id
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
  u.shipping_address as user_shipping_address
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
    // FIX: Pass both orderId and user_id to the execute function
    connection.execute(orderSql, [orderId, user_id], (err, orderResult) => {
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
  COUNT(DISTINCT oi.product_id) as total_items,
  SUM(p.price * oi.quantity) as total_amount,
  GROUP_CONCAT(DISTINCT pt.description) as product_types_in_order
FROM orders o
JOIN status s ON o.stat_id = s.stat_id
JOIN users u ON o.user_id = u.user_id
LEFT JOIN order_items oi ON o.order_id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.product_id
LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
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
        console.error("Error fetching order:", err)
        return res.status(500).json({ success: false, message: "Error fetching order", error: err.message })
      }

      if (orderResult.length === 0) {
        return res.status(404).json({ success: false, message: "Order not found" })
      }

      connection.execute(itemsSql, [orderId], (err, itemsResult) => {
        if (err) {
          console.error("Error fetching order items:", err)
          return res.status(500).json({ success: false, message: "Error fetching order items", error: err.message })
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
    console.error("Server error:", error)
    return res.status(500).json({ success: false, message: "Server error", error: error.message })
  }
}

const updateOrderStatus = (req, res) => {
  const orderId = req.params.id
  const { shipped_date, delivered_date, stat_id } = req.body

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err)
      return res.status(500).json({ success: false, message: "Error starting transaction", error: err.message })
    }

    // 1. Fetch current order details AND its items with user info for email
    const getCurrentOrderAndItemsSql = `
          SELECT
            o.order_id, o.order_date, o.shipped_date, o.delivered_date, o.stat_id,
            s.description as status_description,
            u.email, u.first_name, u.last_name, u.shipping_address,
            oi.product_id, oi.quantity,
            p.title, p.price,
            pt.description as product_type,
            pi.image_url
          FROM orders o
          JOIN status s ON o.stat_id = s.stat_id
          JOIN users u ON o.user_id = u.user_id
          LEFT JOIN order_items oi ON o.order_id = oi.order_id
          LEFT JOIN products p ON oi.product_id = p.product_id
          LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
          LEFT JOIN product_images pi ON p.product_id = pi.product_id
          WHERE o.order_id = ?
        `
    connection.execute(getCurrentOrderAndItemsSql, [orderId], (err, results) => {
      if (err) {
        return connection.rollback(() => {
          console.error("Error fetching current order and items for update:", err)
          res.status(500).json({ success: false, message: "Error fetching current order details", error: err.message })
        })
      }
      if (results.length === 0) {
        return connection.rollback(() => {
          res.status(404).json({ success: false, message: "Order not found" })
        })
      }

      // Reconstruct order object from flat results
      const orderData = {
        order_id: results[0].order_id,
        order_date: results[0].order_date,
        shipped_date: results[0].shipped_date,
        delivered_date: results[0].delivered_date,
        stat_id: results[0].stat_id,
        status_description: results[0].status_description,
        email: results[0].email,
        first_name: results[0].first_name,
        last_name: results[0].last_name,
        shipping_address: results[0].shipping_address,
        items: results[0].product_id
          ? results.map((row) => ({
              product_id: row.product_id,
              quantity: row.quantity,
              title: row.title,
              price: row.price,
              product_type: row.product_type,
              image_url: row.image_url,
            }))
          : [], // Handle case where order has no items (shouldn't happen for valid orders)
      }

      const previousStatId = orderData.stat_id

      let finalStatId = stat_id !== undefined ? stat_id : orderData.stat_id
      let finalShippedDate = shipped_date !== undefined ? shipped_date : orderData.shipped_date
      let finalDeliveredDate = delivered_date !== undefined ? delivered_date : orderData.delivered_date

      if (finalShippedDate === "") finalShippedDate = null
      if (finalDeliveredDate === "") finalDeliveredDate = null

      // Logic for clearing dates based on requested status (Pending, Cancelled)
      if (finalStatId === 1 || finalStatId === 5) {
        finalShippedDate = null
        finalDeliveredDate = null
      }

      // Logic for setting status based on dates (Shipped, Delivered)
      if (finalDeliveredDate !== null) {
        finalStatId = 4 // Delivered
      } else if (finalShippedDate !== null) {
        finalStatId = 3 // Shipped
      }

      // --- NEW LOGIC: Restore stock if status changes to Cancelled ---
      const stockUpdatePromises = []
      if (finalStatId === 5 && previousStatId !== 5) {
        // If new status is Cancelled (5) and old status was not Cancelled
        const physicalItemsToRestore = orderData.items.filter((item) => item.product_type === "physical")
        if (physicalItemsToRestore.length > 0) {
          console.log(`Restoring stock for order ${orderId} due to cancellation.`)
          physicalItemsToRestore.forEach((item) => {
            stockUpdatePromises.push(
              new Promise((resolve, reject) => {
                const updateStockSql = "UPDATE stock SET quantity = quantity + ? WHERE product_id = ?"
                connection.execute(updateStockSql, [item.quantity, item.product_id], (err, result) => {
                  if (err) {
                    console.error(`Error restoring stock for product ${item.product_id}:`, err)
                    reject(err)
                  } else {
                    resolve(result)
                  }
                })
              }),
            )
          })
        }
      }
      // --- END NEW LOGIC ---

      Promise.all(stockUpdatePromises)
        .then(() => {
          const updateFields = []
          const params = []

          updateFields.push("stat_id = ?")
          params.push(finalStatId)

          updateFields.push("shipped_date = ?")
          params.push(finalShippedDate)

          updateFields.push("delivered_date = ?")
          params.push(finalDeliveredDate)

          if (updateFields.length === 0) {
            return connection.rollback(() => {
              res.status(400).json({ success: false, message: "No fields to update" })
            })
          }

          const sql = `UPDATE orders SET ${updateFields.join(", ")} WHERE order_id = ?`
          params.push(orderId)

          connection.execute(sql, params, (err, result) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Error updating order:", err)
                res.status(500).json({ success: false, message: "Error updating order", error: err.message })
              })
            }

            if (result.affectedRows === 0) {
              return connection.rollback(() => {
                res.status(404).json({ success: false, message: "Order not found" })
              })
            }

            connection.commit(async (err) => {
              // Make commit callback async
              if (err) {
                return connection.rollback(() => {
                  console.error("Transaction commit error:", err)
                  res.status(500).json({ success: false, message: "Error finalizing order update", error: err.message })
                })
              }

              // --- Email Sending Logic ---
              try {
                // Re-fetch the order details to get the *new* status description
                const getUpdatedOrderSql = `
                      SELECT
                        o.order_id, o.order_date, o.shipped_date, o.delivered_date, o.stat_id,
                        s.description as status_description,
                        u.email, u.first_name, u.last_name, u.shipping_address,
                        oi.product_id, oi.quantity,
                        p.title, p.price,
                        pt.description as product_type,
                        pi.image_url
                      FROM orders o
                      JOIN status s ON o.stat_id = s.stat_id
                      JOIN users u ON o.user_id = u.user_id
                      LEFT JOIN order_items oi ON o.order_id = oi.order_id
                      LEFT JOIN products p ON oi.product_id = p.product_id
                      LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
                      LEFT JOIN product_images pi ON p.product_id = pi.product_id
                      WHERE o.order_id = ?
                    `
                const [updatedOrderResults] = await connection.promise().execute(getUpdatedOrderSql, [orderId])

                if (updatedOrderResults.length > 0) {
                  const updatedOrder = {
                    order_id: updatedOrderResults[0].order_id,
                    order_date: updatedOrderResults[0].order_date,
                    shipped_date: updatedOrderResults[0].shipped_date,
                    delivered_date: updatedOrderResults[0].delivered_date,
                    stat_id: updatedOrderResults[0].stat_id,
                    status_description: updatedOrderResults[0].status_description,
                    email: updatedOrderResults[0].email,
                    first_name: updatedOrderResults[0].first_name,
                    last_name: updatedOrderResults[0].last_name,
                    shipping_address: updatedOrderResults[0].shipping_address,
                    items: updatedOrderResults[0].product_id
                      ? updatedOrderResults.map((row) => ({
                          product_id: row.product_id,
                          quantity: row.quantity,
                          title: row.title,
                          price: row.price,
                          product_type: row.product_type,
                          image_url: row.image_url,
                        }))
                      : [],
                  }

                  const orderDate = new Date(updatedOrder.order_date).toLocaleDateString()
                  const shippedDate = updatedOrder.shipped_date
                    ? new Date(updatedOrder.shipped_date).toLocaleDateString()
                    : "N/A"
                  const deliveredDate = updatedOrder.delivered_date
                    ? new Date(updatedOrder.delivered_date).toLocaleDateString()
                    : "N/A"
                  const totalAmount = updatedOrder.items.reduce(
                    (sum, item) => sum + Number(item.price) * item.quantity,
                    0,
                  )

                  // Generate HTML for email body
                  const emailHtml = `
                        <p>Dear ${updatedOrder.first_name} ${updatedOrder.last_name},</p>
                        <p>Your order #${updatedOrder.order_id} has been updated!</p>
                        <p><strong>New Status:</strong> <span style="text-transform: capitalize;">${updatedOrder.status_description}</span></p>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Shipped Date:</strong> ${shippedDate}</p>
                        <p><strong>Delivered Date:</strong> ${deliveredDate}</p>
                        <p>You can view your order details by logging into your account.</p>
                        <p>A detailed receipt is attached to this email.</p>
                        <p>Thank you for shopping with Bits & Bytes!</p>
                      `

                  // Generate HTML for PDF receipt
                  const pdfHtml = `
                        <h1 style="text-align: center; color: #333;">Order Receipt - Bits & Bytes</h1>
                        <hr style="border: 1px solid #eee; margin-bottom: 20px;">
                        <p><strong>Order ID:</strong> #${updatedOrder.order_id}</p>
                        <p><strong>Order Date:</strong> ${orderDate}</p>
                        <p><strong>Current Status:</strong> <span style="text-transform: capitalize;">${updatedOrder.status_description}</span></p>
                        <p><strong>Shipped Date:</strong> ${shippedDate}</p>
                        <p><strong>Delivered Date:</strong> ${deliveredDate}</p>
                        <br>
                        <p><strong>Customer Name:</strong> ${updatedOrder.first_name} ${updatedOrder.last_name}</p>
                        <p><strong>Customer Email:</strong> ${updatedOrder.email}</p>
                        ${updatedOrder.shipping_address ? `<p><strong>Shipping Address:</strong> ${updatedOrder.shipping_address}</p>` : ""}
                        <br>
                        <h2 style="color: #333;">Order Items:</h2>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                          <thead>
                            <tr style="background-color: #f2f2f2;">
                              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Type</th>
                              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
                              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
                              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${updatedOrder.items
                              .map(
                                (item) => `
                              <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-transform: capitalize;">${item.product_type}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${Number(item.price).toFixed(2)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${(Number(item.price) * item.quantity).toFixed(2)}</td>
                              </tr>
                            `,
                              )
                              .join("")}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colspan="4" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total Amount:</td>
                              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">$${totalAmount.toFixed(2)}</td>
                            </tr>
                          </tfoot>
                        </table>
                        <p style="text-align: center; font-size: 12px; color: #777;">Thank you for your purchase!</p>
                      `

                  const pdfBuffer = await generatePdf(pdfHtml)

                  await sendEmail({
                    email: updatedOrder.email,
                    subject: `Order #${updatedOrder.order_id} Status Update: ${updatedOrder.status_description.charAt(0).toUpperCase() + updatedOrder.status_description.slice(1)}`,
                    html: emailHtml,
                    attachments: [
                      {
                        filename: `receipt_order_${updatedOrder.order_id}.pdf`,
                        content: pdfBuffer,
                        contentType: "application/pdf",
                      },
                    ],
                  })
                }
              } catch (emailError) {
                console.error("Failed to send order update email:", emailError)
                // Do not rollback the transaction here, as the order update was successful.
                // Just log the email error.
              }
              // --- End Email Sending Logic ---

              res.status(200).json({ success: true, message: "Order updated successfully" })
            })
          })
        })
        .catch((err) => {
          connection.rollback(() => {
            console.error("Stock restoration failed:", err)
            res.status(500).json({
              success: false,
              message: "Failed to update order due to stock restoration error",
              error: err.message,
            })
          })
        })
    })
  })
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

    // First, get the order's current status
    const getOrderStatusSql = "SELECT stat_id FROM orders WHERE order_id = ?"
    connection.execute(getOrderStatusSql, [orderId], (err, orderStatusResult) => {
      if (err) {
        return connection.rollback(() => {
          console.log(err)
          res.status(500).json({ success: false, message: "Error fetching order status", error: err.message })
        })
      }

      if (orderStatusResult.length === 0) {
        return connection.rollback(() => {
          res.status(404).json({ success: false, message: "Order not found" })
        })
      }

      const currentStatId = orderStatusResult[0].stat_id

      // Only restore stock if the order is pending (1) or processing (2)
      if (currentStatId === 1 || currentStatId === 2) {
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
              res.status(500).json({ success: false, message: "Error fetching order items", error: err.message })
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
                  res.status(500).json({ success: false, message: "Error restoring stock", error: err.message })
                })
              }

              completedUpdates++
              if (completedUpdates === physicalItems.length && !hasError) {
                deleteOrderRecord()
              }
            })
          })
        })
      } else {
        // If status is not pending or processing, directly delete the order without stock restoration
        console.log(`Order ${orderId} status is ${currentStatId}, skipping stock restoration on delete.`)
        deleteOrderRecord()
      }

      function deleteOrderRecord() {
        const deleteOrderSql = "DELETE FROM orders WHERE order_id = ?"
        connection.execute(deleteOrderSql, [orderId], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              console.log(err)
              res.status(500).json({ success: false, message: "Error deleting order", error: err.message })
            })
          }

          if (result.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ success: false, message: "Order not found" })
            })
          }

          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ success: false, message: "Error committing transaction", error: err.message })
              })
            }

            res.status(200).json({
              success: true,
              message:
                "Order deleted successfully" +
                (currentStatId === 1 || currentStatId === 2 ? " and stock restored" : ""),
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
