const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(401).json({ message: "Login first to access this resource" })
  }

  const token = req.header("Authorization").split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Login first to access this resource" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Store user info in req.user instead of req.body.user
    req.user = {
      id: decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    }
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }
}
