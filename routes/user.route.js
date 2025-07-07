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
  getAllUsers,
} = require("../controllers/user.controller.js")

// const { isAuthenticatedUser } = require("../middlewares/auth.js")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.get("/profile/:user_id", getUserProfile)
router.put("/profile/:user_id", upload.single("image"), updateUser)
router.put("/deactivate/:user_id", deactivateUser)
router.put("/reactivate/:user_id", reactivateUser)
router.get("/", getAllUsers)

module.exports = router
