const jwt = require("jsonwebtoken")
const connection = require("../config/database")

const isAuthenticatedUser = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  console.log("=== Auth Middleware Debug ===")
  console.log("Auth Header:", authHeader ? "Bearer " + authHeader.split(" ")[1].substring(0, 50) + "..." : "null")
  console.log("Token Length:", token ? token.length : 0)

  if (!token) {
    console.log("No token provided")
    return res.status(401).json({
      success: false,
      message: "Access token is required",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("JWT decoded successfully:", {
      user_id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp,
    })

    // Check if token exists in database and is not expired
    const tokenSql = `
      SELECT user_id, email, deleted, token_expires_at, token,
             CHAR_LENGTH(token) as db_token_length
      FROM users 
      WHERE user_id = ? AND deleted = 0
    `

    connection.execute(tokenSql, [decoded.user_id], (err, results) => {
      if (err) {
        console.log("Database error during token verification:", err)
        return res.status(500).json({
          success: false,
          message: "Error verifying token",
        })
      }

      console.log("Database query results:", {
        resultsCount: results.length,
        userId: decoded.user_id,
      })

      if (results.length === 0) {
        console.log("User not found or deactivated")
        return res.status(403).json({
          success: false,
          message: "User not found or account deactivated",
        })
      }

      const user = results[0]
      const dbToken = user.token

      // Check if user is deactivated
      if (user.deleted) {
        console.log("User account is deactivated")
        return res.status(403).json({
          success: false,
          message: "Account has been deactivated",
        })
      }

      // Check if token matches exactly
      if (token !== dbToken) {
        console.log("=== TOKEN MISMATCH DETECTED ===")
        console.log("Frontend token length:", token.length)
        console.log("Database token length:", user.db_token_length)
        console.log("Frontend token (first 100 chars):", token.substring(0, 100))
        console.log("Database token (first 100 chars):", dbToken ? dbToken.substring(0, 100) : "NULL")

        // Decode both tokens to compare their contents
        try {
          const frontendDecoded = jwt.decode(token)
          const dbDecoded = dbToken ? jwt.decode(dbToken) : null

          console.log("Frontend token decoded:", {
            user_id: frontendDecoded.user_id,
            iat: frontendDecoded.iat,
            exp: frontendDecoded.exp,
          })
          console.log(
            "Database token decoded:",
            dbDecoded
              ? {
                  user_id: dbDecoded.user_id,
                  iat: dbDecoded.iat,
                  exp: dbDecoded.exp,
                }
              : "NULL",
          )
        } catch (decodeError) {
          console.log("Error decoding tokens for comparison:", decodeError.message)
        }

        return res.status(403).json({
          success: false,
          message: "Invalid session - token mismatch. Please log in again.",
        })
      }

      // Check if token is expired in database
      const now = new Date()
      const expiresAt = new Date(user.token_expires_at)

      console.log("Token expiration check:", {
        now: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        is_expired: now > expiresAt,
      })

      if (now > expiresAt) {
        console.log("Token expired in database")
        return res.status(403).json({
          success: false,
          message: "Session expired",
        })
      }

      req.user = {
        id: decoded.user_id,
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      }

      console.log("Authentication successful, proceeding to next middleware")
      next()
    })
  } catch (error) {
    console.log("JWT verification error:", error.message)
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
  console.log("Admin check - User role:", req.user.role)
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
