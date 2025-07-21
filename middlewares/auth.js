const jwt = require("jsonwebtoken")
const connection = require("../config/database")

const isAuthenticatedUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if token exists in database and is not expired
    const tokenSql = `
      SELECT user_id, email, deleted, token_expires_at
      FROM users 
      WHERE user_id = ? AND token = ? AND token_expires_at > NOW() AND deleted = 0
    `

    connection.execute(tokenSql, [decoded.user_id, token], (err, results) => {
      if (err) {
        console.log("Database error during token verification:", err)
        return res.status(500).json({
          success: false,
          message: "Error verifying token",
        })
      }

      if (results.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired session",
        })
      }

      const user = results[0]

      // Check if user is deactivated
      if (user.deleted) {
        return res.status(403).json({
          success: false,
          message: "Account has been deactivated",
        })
      }

      req.user = {
        id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      }
      next()
    })
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token has expired",
      })
    }
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    })
  }
}

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    })
  }
  next()
}

module.exports = {
  isAuthenticatedUser,
  isAdmin,
}
