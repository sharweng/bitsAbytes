const express = require("express")
const router = express.Router()
const upload = require("../utils/multer")
const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
  deactivateUser,
  reactivateUser,
  getUserProfile,
  getAllUsers,
  getAllRoles,
  changePassword,
} = require("../controllers/user.controller.js")

const { isAuthenticatedUser, isAdmin } = require("../middlewares/auth.js")

// Public routes
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.post("/logout", isAuthenticatedUser, logoutUser)
router.get("/profile/:user_id", isAuthenticatedUser, getUserProfile)
router.put("/profile/:user_id", isAuthenticatedUser, upload.single("image"), updateUser)
router.put("/change-password/:user_id", isAuthenticatedUser, changePassword)

router.put("/deactivate/:user_id", isAuthenticatedUser, isAdmin, deactivateUser)
router.put("/reactivate/:user_id", isAuthenticatedUser, isAdmin, reactivateUser)
router.get("/roles", getAllRoles)
router.get("/", isAuthenticatedUser, isAdmin, getAllUsers)

module.exports = router
