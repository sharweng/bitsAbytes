const connection = require("../config/database")

// Simple profanity filter implementation
const badWords = [
  "fuck",
  "shit",
  "damn",
  "bitch",
  "ass",
  "hell",
  "crap",
  "piss",
  "bastard",
  "whore",
  "slut",
  "cock",
  "dick",
  "pussy",
  "tits",
  "nigger",
  "faggot",
  "retard",
  "gay",
  "lesbian",
  "homo",
  // Add more words as needed
]

const filterProfanity = (text) => {
  if (!text) return text

  let filteredText = text
  badWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    filteredText = filteredText.replace(regex, "*".repeat(word.length))
  })
  return filteredText
}

const getAllReviews = (req, res) => {
  const { product_id, user_id, rating_filter } = req.query

  let whereClause = ""
  const params = []

  if (product_id) {
    whereClause += "WHERE r.product_id = ?"
    params.push(product_id)
  }

  if (user_id) {
    whereClause += whereClause ? " AND r.user_id = ?" : "WHERE r.user_id = ?"
    params.push(user_id)
  }

  if (rating_filter) {
    whereClause += whereClause ? " AND r.rating = ?" : "WHERE r.rating = ?"
    params.push(rating_filter)
  }

  const sql = `
        SELECT 
            r.review_id,
            r.user_id,
            r.product_id,
            r.rating,
            r.review_title,
            r.review_text,
            r.created_at,
            r.updated_at,
            u.first_name,
            u.last_name,
            u.email,
            p.title as product_title
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN products p ON r.product_id = p.product_id
        ${whereClause}
        ORDER BY r.created_at DESC
    `

  try {
    connection.execute(sql, params, (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching reviews",
          error: err.message,
        })
      }

      return res.status(200).json({
        success: true,
        reviews: results,
        total_reviews: results.length,
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

const getReview = (req, res) => {
  const reviewId = req.params.id

  const sql = `
        SELECT 
            r.review_id,
            r.user_id,
            r.product_id,
            r.rating,
            r.review_title,
            r.review_text,
            r.created_at,
            r.updated_at,
            u.first_name,
            u.last_name,
            u.email,
            p.title as product_title
        FROM reviews r
        JOIN users u ON r.user_id = u.user_id
        JOIN products p ON r.product_id = p.product_id
        WHERE r.review_id = ?
    `

  try {
    connection.execute(sql, [reviewId], (err, results) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error fetching review",
          error: err.message,
        })
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      return res.status(200).json({
        success: true,
        review: results[0],
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

const addReview = (req, res) => {
  const { user_id, product_id, rating, review_title, review_text } = req.body

  if (!user_id || !product_id || !rating) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: user_id, product_id, and rating",
    })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    })
  }

  // Filter bad words from review title and text
  const filteredTitle = filterProfanity(review_title)
  const filteredText = filterProfanity(review_text)

  const sql = `
        INSERT INTO reviews (user_id, product_id, rating, review_title, review_text) 
        VALUES (?, ?, ?, ?, ?)
    `
  const values = [user_id, product_id, rating, filteredTitle, filteredText]

  try {
    connection.execute(sql, values, (err, result) => {
      if (err) {
        console.log(err)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({
            success: false,
            message: "You have already reviewed this product",
          })
        }
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            success: false,
            message: "Invalid user_id or product_id",
          })
        }
        return res.status(500).json({
          success: false,
          message: "Error creating review",
          error: err.message,
        })
      }

      return res.status(201).json({
        success: true,
        message: "Review created successfully",
        review_id: result.insertId,
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

const updateReview = (req, res) => {
  const reviewId = req.params.id
  const { rating, review_title, review_text } = req.body

  if (!rating && !review_title && !review_text) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided for update",
    })
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    })
  }

  // Filter bad words from review title and text
  const filteredTitle = review_title ? filterProfanity(review_title) : review_title
  const filteredText = review_text ? filterProfanity(review_text) : review_text

  const sql = `
        UPDATE reviews 
        SET rating = COALESCE(?, rating),
            review_title = COALESCE(?, review_title),
            review_text = COALESCE(?, review_text),
            updated_at = CURRENT_TIMESTAMP
        WHERE review_id = ?
    `
  const values = [rating, filteredTitle, filteredText, reviewId]

  try {
    connection.execute(sql, values, (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error updating review",
          error: err.message,
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
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

const deleteReview = (req, res) => {
  const reviewId = req.params.id

  const sql = "DELETE FROM reviews WHERE review_id = ?"

  try {
    connection.execute(sql, [reviewId], (err, result) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          success: false,
          message: "Error deleting review",
          error: err.message,
        })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Review not found",
        })
      }

      return res.status(200).json({
        success: true,
        message: "Review deleted successfully",
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

const checkUserPurchase = (req, res) => {
  console.log("=== CHECK USER PURCHASE FUNCTION CALLED ===")
  console.log("Query params:", req.query)

  const { user_id, product_id } = req.query

  if (!user_id || !product_id) {
    console.log("❌ Missing parameters")
    return res.status(400).json({
      success: false,
      message: "User ID and Product ID are required",
    })
  }

  console.log(`✅ Checking purchase for user ${user_id}, product ${product_id}`)

  // Check if user purchased this product AND it was delivered (stat_id = 4)
  const purchaseCheckSql = `
    SELECT COUNT(*) as purchase_count
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.user_id = ? AND oi.product_id = ? AND o.stat_id = 4
  `

  // Get user's existing review if any
  const reviewCheckSql = `
    SELECT * FROM reviews 
    WHERE user_id = ? AND product_id = ?
  `

  try {
    console.log("🔍 Executing purchase check query...")
    connection.execute(purchaseCheckSql, [user_id, product_id], (err, purchaseResult) => {
      if (err) {
        console.log("❌ Purchase check error:", err)
        return res.status(500).json({
          success: false,
          message: "Error checking purchase history",
          error: err.message,
        })
      }

      console.log("✅ Purchase check result:", purchaseResult)
      const hasPurchased = purchaseResult[0].purchase_count > 0
      console.log("📊 Has purchased and delivered:", hasPurchased)

      console.log("🔍 Executing review check query...")
      connection.execute(reviewCheckSql, [user_id, product_id], (err, reviewResult) => {
        if (err) {
          console.log("❌ Review check error:", err)
          return res.status(500).json({
            success: false,
            message: "Error checking existing review",
            error: err.message,
          })
        }

        console.log("✅ Review check result:", reviewResult)
        const existingReview = reviewResult.length > 0 ? reviewResult[0] : null
        console.log("📝 Existing review:", existingReview ? "Found" : "None")

        const response = {
          success: true,
          has_purchased: hasPurchased,
          existing_review: existingReview,
        }

        console.log("📤 Sending response:", response)
        return res.status(200).json(response)
      })
    })
  } catch (error) {
    console.log("❌ Catch error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

module.exports = {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  checkUserPurchase,
}
