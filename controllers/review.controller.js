const connection = require("../config/database")

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

  const sql = `
        INSERT INTO reviews (user_id, product_id, rating, review_title, review_text) 
        VALUES (?, ?, ?, ?, ?)
    `
  const values = [user_id, product_id, rating, review_title, review_text]

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

  const sql = `
        UPDATE reviews 
        SET rating = COALESCE(?, rating),
            review_title = COALESCE(?, review_title),
            review_text = COALESCE(?, review_text),
            updated_at = CURRENT_TIMESTAMP
        WHERE review_id = ?
    `
  const values = [rating, review_title, review_text, reviewId]

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

module.exports = {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
}
