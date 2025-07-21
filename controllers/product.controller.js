const connection = require("../config/database")

const getAllProducts = (req, res) => {
  // Extract pagination and filter parameters
  const page = Number.parseInt(req.query.page) || 1
  const limit = Number.parseInt(req.query.limit) || 12
  const offset = (page - 1) * limit

  // Extract filter parameters
  const { search, platform, type, sort = "newest" } = req.query

  // Build WHERE clause
  const whereConditions = []
  const queryParams = []

  if (search) {
    whereConditions.push(`(
      p.title LIKE ? OR 
      p.developer LIKE ? OR 
      p.publisher LIKE ? OR 
      p.description LIKE ?
    )`)
    const searchTerm = `%${search}%`
    queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm)
  }

  if (platform) {
    whereConditions.push("p.plat_id = ?")
    queryParams.push(platform)
  }

  if (type) {
    whereConditions.push("p.ptype_id = ?")
    queryParams.push(type)
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""

  // Build ORDER BY clause
  let orderBy = "ORDER BY p.created_at DESC" // default
  switch (sort) {
    case "price_low":
      orderBy = "ORDER BY p.price ASC"
      break
    case "price_high":
      orderBy = "ORDER BY p.price DESC"
      break
    case "title_asc":
      orderBy = "ORDER BY p.title ASC"
      break
    case "title_desc":
      orderBy = "ORDER BY p.title DESC"
      break
    case "oldest":
      orderBy = "ORDER BY p.product_id ASC"
      break
    case "newest":
    default:
      orderBy = "ORDER BY p.product_id DESC"
      break
  }

  // First, get the total count for pagination info
  const countSql = `
    SELECT COUNT(*) as total
    FROM products p 
    LEFT JOIN stock s ON p.product_id = s.product_id
    LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
    LEFT JOIN platform_types plt ON p.plat_id = plt.plat_id
    ${whereClause}
  `

  // Main query with pagination
  const sql = `
  SELECT 
    p.*,
    s.quantity,
    pt.description as product_type,
    plt.description as platform_type,
    GROUP_CONCAT(DISTINCT pi.image_url) as images,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.review_id) as review_count
  FROM products p 
  LEFT JOIN stock s ON p.product_id = s.product_id
  LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
  LEFT JOIN platform_types plt ON p.plat_id = plt.plat_id
  LEFT JOIN product_images pi ON p.product_id = pi.product_id
  LEFT JOIN reviews r ON p.product_id = r.product_id
  ${whereClause}
  GROUP BY p.product_id
  ${orderBy}
  LIMIT ? OFFSET ?
`

  try {
    // Get total count first
    connection.execute(countSql, queryParams, (err, countResult) => {
      if (err) {
        console.log("Database error:", err)
        return res.status(500).json({ error: "Database error", details: err.message })
      }

      const totalProducts = countResult[0].total
      const totalPages = Math.ceil(totalProducts / limit)
      const hasMore = page < totalPages

      // Add pagination parameters to query
      const paginationParams = [...queryParams, limit, offset]

      // Get paginated results
      connection.execute(sql, paginationParams, (err, rows) => {
        if (err) {
          console.log("Database error:", err)
          return res.status(500).json({ error: "Database error", details: err.message })
        }

        // Process the images for each product
        const processedRows = rows.map((row) => ({
          ...row,
          images: row.images ? row.images.split(",") : [],
        }))

        console.log(`Page ${page}: Found ${processedRows.length} products (${totalProducts} total)`)

        // Return response in format that works for both infinite scroll and DataTable
        return res.status(200).json({
          success: true,
          products: processedRows, // New format for infinite scroll
          rows: processedRows, // Legacy format for DataTable compatibility
          total: processedRows.length,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalProducts: totalProducts,
            hasMore: hasMore,
            limit: limit,
          },
        })
      })
    })
  } catch (error) {
    console.log("Server error:", error)
    return res.status(500).json({ error: "Server error", details: error.message })
  }
}

const getProduct = (req, res) => {
  const sql = `
  SELECT 
    p.*,
    s.quantity,
    pt.description as product_type,
    plt.description as platform_type,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.review_id) as review_count
  FROM products p 
  LEFT JOIN stock s ON p.product_id = s.product_id
  LEFT JOIN product_types pt ON p.ptype_id = pt.ptype_id
  LEFT JOIN platform_types plt ON p.plat_id = plt.plat_id
  LEFT JOIN reviews r ON p.product_id = r.product_id
  WHERE p.product_id = ?
  GROUP BY p.product_id
`

  const imagesSql = "SELECT image_url FROM product_images WHERE product_id = ?"
  const values = [Number.parseInt(req.params.id)]

  try {
    connection.execute(sql, values, (err, result, fields) => {
      if (err instanceof Error) {
        console.log(err)
        return res.status(500).json({ error: "Database error" })
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "Product not found" })
      }

      // Get product images
      connection.execute(imagesSql, values, (err, images) => {
        if (err instanceof Error) {
          console.log(err)
          return res.status(500).json({ error: "Database error fetching images" })
        }

        const product = {
          ...result[0],
          images: images.map((img) => img.image_url),
        }

        return res.status(200).json({ success: true, result: product })
      })
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Server error" })
  }
}

// Get all platform types
const getPlatformTypes = (req, res) => {
  const sql = "SELECT plat_id, description FROM platform_types ORDER BY plat_id"

  connection.execute(sql, [], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error fetching platform types",
        error: err.message,
      })
    }

    return res.status(200).json({
      success: true,
      platforms: results,
    })
  })
}

// Get all product types
const getProductTypes = (req, res) => {
  const sql = "SELECT ptype_id, description FROM product_types ORDER BY ptype_id"

  connection.execute(sql, [], (err, results) => {
    if (err) {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: "Error fetching product types",
        error: err.message,
      })
    }

    return res.status(200).json({
      success: true,
      productTypes: results,
    })
  })
}

const addProduct = (req, res) => {
  const {
    title,
    description,
    plat_id,
    price,
    ptype_id = 1, // Default to digital (1)
    releaseDate,
    developer,
    publisher,
    quantity = 0, // Default quantity for physical products
  } = req.body

  // Handle multiple image files
  let imagePaths = []
  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => file.path.replace(/\\/g, "/"))
  } else if (req.file) {
    imagePaths = [req.file.path.replace(/\\/g, "/")]
  }

  if (!title || !price) {
    return res.status(400).json({ error: "Missing required fields: title and price" })
  }

  // Validate quantity for physical products
  if (Number.parseInt(ptype_id) === 2) {
    // Physical product
    if (quantity === undefined || quantity === null || Number.parseInt(quantity) < 0) {
      return res.status(400).json({ error: "Quantity is required and must be non-negative for physical products" })
    }
  }

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err)
      return res.status(500).json({ success: false, message: "Error starting transaction", error: err.message })
    }

    const sql = `
        INSERT INTO products (title, description, plat_id, price, ptype_id, release_date, developer, publisher) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
    const values = [title, description, plat_id, price, ptype_id, releaseDate, developer, publisher]

    connection.execute(sql, values, (err, result) => {
      if (err) {
        return connection.rollback(() => {
          console.error("Error inserting product:", err)
          res.status(500).json({ error: "Error inserting product", details: err.message })
        })
      }

      const productId = result.insertId
      const promises = []

      // Insert stock only if it's a physical product (ptype_id = 2)
      if (Number.parseInt(ptype_id) === 2) {
        promises.push(
          new Promise((resolve, reject) => {
            const stockSql = "INSERT INTO stock (product_id, quantity) VALUES (?, ?)"
            const stockValues = [productId, quantity]
            connection.execute(stockSql, stockValues, (err, stockResult) => {
              if (err) {
                console.error("Error inserting stock:", err)
                reject(err)
              } else {
                resolve(stockResult)
              }
            })
          }),
        )
      }

      // Insert product images if any
      if (imagePaths.length > 0) {
        imagePaths.forEach((imagePath) => {
          promises.push(
            new Promise((resolve, reject) => {
              const imageSql = "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)"
              connection.execute(imageSql, [productId, imagePath], (err, result) => {
                if (err) reject(err)
                else resolve(result)
              })
            }),
          )
        })
      }

      Promise.all(promises)
        .then(() => {
          connection.commit((err) => {
            if (err) {
              return connection.rollback(() => {
                console.error("Transaction commit error:", err)
                res
                  .status(500)
                  .json({ success: false, message: "Error finalizing product creation", error: err.message })
              })
            }
            res.status(201).json({
              success: true,
              productId: productId,
              images: imagePaths,
              quantity,
              message: "Product added successfully",
            })
          })
        })
        .catch((err) => {
          connection.rollback(() => {
            console.error("Error during product creation (stock/images):", err)
            res.status(500).json({ error: "Error adding product details", details: err.message })
          })
        })
    })
  })
}

const updateProduct = (req, res) => {
  const id = req.params.id
  const { title, description, plat_id, price, ptype_id, releaseDate, developer, publisher, quantity } = req.body

  // Handle multiple image files
  let imagePaths = []
  if (req.files && req.files.length > 0) {
    imagePaths = req.files.map((file) => file.path.replace(/\\/g, "/"))
  } else if (req.file) {
    imagePaths = [req.file.path.replace(/\\/g, "/")]
  }

  if (!title || !price) {
    return res.status(400).json({ error: "Missing required fields: title and price" })
  }

  connection.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err)
      return res.status(500).json({ success: false, message: "Error starting transaction", error: err.message })
    }

    // 1. Get current product type and quantity
    const getCurrentProductSql = `
      SELECT p.ptype_id, s.quantity 
      FROM products p 
      LEFT JOIN stock s ON p.product_id = s.product_id 
      WHERE p.product_id = ?
    `
    connection.execute(getCurrentProductSql, [id], (err, currentProductResult) => {
      if (err) {
        return connection.rollback(() => {
          console.error("Error fetching current product details:", err)
          res
            .status(500)
            .json({ success: false, message: "Error fetching current product details", error: err.message })
        })
      }

      if (currentProductResult.length === 0) {
        return connection.rollback(() => {
          res.status(404).json({ success: false, message: "Product not found" })
        })
      }

      const currentPtypeId = currentProductResult[0].ptype_id
      const currentQuantity = currentProductResult[0].quantity

      const newPtypeId = Number.parseInt(ptype_id)
      const newQuantity = quantity !== undefined ? Number.parseInt(quantity) : currentQuantity

      // Validate quantity for physical products
      if (newPtypeId === 2) {
        // Physical product
        if (newQuantity === undefined || newQuantity === null || newQuantity < 0) {
          return connection.rollback(() => {
            res.status(400).json({ error: "Quantity is required and must be non-negative for physical products" })
          })
        }
      }

      // 2. Update product details
      const updateProductSql = `
        UPDATE products 
        SET title = ?, description = ?, plat_id = ?, price = ?, ptype_id = ?, 
            release_date = ?, developer = ?, publisher = ? 
        WHERE product_id = ?
      `
      const updateProductValues = [
        title,
        description,
        plat_id,
        price,
        newPtypeId,
        releaseDate,
        developer,
        publisher,
        id,
      ]

      connection.execute(updateProductSql, updateProductValues, (err, productResult) => {
        if (err) {
          return connection.rollback(() => {
            console.error("Error updating product:", err)
            res.status(500).json({ error: "Error updating product", details: err.message })
          })
        }

        const promises = []

        // 3. Handle stock updates based on product type change
        if (currentPtypeId === 1 && newPtypeId === 2) {
          // Digital to Physical: Insert new stock entry
          promises.push(
            new Promise((resolve, reject) => {
              const insertStockSql = "INSERT INTO stock (product_id, quantity) VALUES (?, ?)"
              connection.execute(insertStockSql, [id, newQuantity], (err, result) => {
                if (err) reject(err)
                else resolve(result)
              })
            }),
          )
        } else if (currentPtypeId === 2 && newPtypeId === 1) {
          // Physical to Digital: Delete stock entry
          promises.push(
            new Promise((resolve, reject) => {
              const deleteStockSql = "DELETE FROM stock WHERE product_id = ?"
              connection.execute(deleteStockSql, [id], (err, result) => {
                if (err) reject(err)
                else resolve(result)
              })
            }),
          )
        } else if (currentPtypeId === 2 && newPtypeId === 2 && quantity !== undefined) {
          // Physical to Physical with quantity update: Update existing stock
          promises.push(
            new Promise((resolve, reject) => {
              const updateStockSql = "UPDATE stock SET quantity = ? WHERE product_id = ?"
              connection.execute(updateStockSql, [newQuantity, id], (err, result) => {
                if (err) reject(err)
                else resolve(result)
              })
            }),
          )
        }

        // 4. Handle image updates if new images are provided
        if (imagePaths.length > 0) {
          promises.push(
            new Promise((resolve, reject) => {
              const deleteImagesSql = "DELETE FROM product_images WHERE product_id = ?"
              connection.execute(deleteImagesSql, [id], (err) => {
                if (err) {
                  reject(err)
                } else {
                  const imageInsertPromises = imagePaths.map((imagePath) => {
                    return new Promise((resImg, rejImg) => {
                      const imageSql = "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)"
                      connection.execute(imageSql, [id, imagePath], (err, result) => {
                        if (err) rejImg(err)
                        else resImg(result)
                      })
                    })
                  })
                  Promise.all(imageInsertPromises).then(resolve).catch(reject)
                }
              })
            }),
          )
        }

        Promise.all(promises)
          .then(() => {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  console.error("Transaction commit error:", err)
                  res
                    .status(500)
                    .json({ success: false, message: "Error finalizing product update", error: err.message })
                })
              }
              res.status(200).json({
                success: true,
                message: "Product updated successfully",
                images: imagePaths,
              })
            })
          })
          .catch((err) => {
            connection.rollback(() => {
              console.error("Error during product update (stock/images):", err)
              res.status(500).json({ error: "Error updating product details", details: err.message })
            })
          })
      })
    })
  })
}

const deleteProduct = (req, res) => {
  const id = req.params.id

  // Due to CASCADE DELETE, product_images and stock will be automatically deleted
  const sql = "DELETE FROM products WHERE product_id = ?"
  const values = [id]

  connection.execute(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.status(500).json({ error: "Error deleting product", details: err })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" })
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully (images and stock automatically removed)",
    })
  })
}

module.exports = {
  getAllProducts,
  getProduct,
  getPlatformTypes,
  getProductTypes,
  addProduct,
  updateProduct,
  deleteProduct,
}
