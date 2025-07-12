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
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    }
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
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
