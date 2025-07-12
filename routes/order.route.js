const express = require("express")
const router = express.Router()
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  getAllOrders,
  getOrderDetailsAdmin,
  updateOrderStatus,
  deleteOrder,
  getOrderStatuses,
} = require("../controllers/order.controller.js")

const { isAuthenticatedUser, isAdmin } = require("../middlewares/auth.js")

// User routes
router.post("/", isAuthenticatedUser, createOrder)
router.get("/my-orders", isAuthenticatedUser, getUserOrders)
router.get("/my-orders/:id", isAuthenticatedUser, getOrderDetails)

// Admin routes
router.get("/", isAuthenticatedUser, isAdmin, getAllOrders)
router.get("/:id", isAuthenticatedUser, isAdmin, getOrderDetailsAdmin)
router.put("/:id", isAuthenticatedUser, isAdmin, updateOrderStatus)
router.delete("/:id", isAuthenticatedUser, isAdmin, deleteOrder)
router.get("/statuses/all", getOrderStatuses)

module.exports = router
