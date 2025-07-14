const express = require("express")
const router = express.Router()
const upload = require("../utils/multer.js")
const {
  getAllProducts,
  getProduct,
  getPlatformTypes,
  getProductTypes,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller.js")

const { isAuthenticatedUser, isAdmin } = require("../middlewares/auth.js")

router.get("/", getAllProducts)
router.get("/platforms", getPlatformTypes)
router.get("/types", getProductTypes)
router.get("/:id", getProduct)

router.post("/", isAuthenticatedUser, isAdmin, upload.any("image"), addProduct)
router.put("/:id", isAuthenticatedUser, isAdmin, upload.any("image"), updateProduct)
router.delete("/:id", isAuthenticatedUser, isAdmin, deleteProduct)

module.exports = router
