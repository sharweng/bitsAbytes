const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const {
  registerUser,
  loginUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  getUserProfile,
} = require("../controllers/user.controller")

const { isAuthenticatedUser } = require("../middlewares/auth")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.get("/profile/:user_id", isAuthenticatedUser, getUserProfile)
router.put("/update-profile", isAuthenticatedUser, upload.single("image"), updateUser)
router.put("/deactivate", isAuthenticatedUser, deactivateUser)
router.put("/reactivate", isAuthenticatedUser, reactivateUser)

module.exports = router
