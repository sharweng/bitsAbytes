const express = require("express")
const router = express.Router()
const {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  checkUserPurchase,
} = require("../controllers/review.controller.js")

const { isAuthenticatedUser } = require("../middlewares/auth.js")

// Public routes
router.get("/", getAllReviews)
router.get("/check-purchase", checkUserPurchase) // Specific route first
router.get("/:id", getReview) // Parameterized route second

// Protected routes (require authentication)
router.post("/", isAuthenticatedUser, addReview)
router.put("/:id", isAuthenticatedUser, updateReview)
router.delete("/:id", isAuthenticatedUser, deleteReview)

module.exports = router
