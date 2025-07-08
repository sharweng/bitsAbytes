const express = require('express');
const router = express.Router();
const upload = require('../utils/multer.js')
const { getAllProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct, } = require('../controllers/product.controller.js')

const {isAuthenticatedUser} = require('../middlewares/auth.js')

router.get('/', getAllProducts)
router.get('/:id', getProduct)
router.post('/', isAuthenticatedUser, upload.any('image'), addProduct)
router.put('/:id', isAuthenticatedUser, upload.any('image'), updateProduct)
router.delete('/:id', isAuthenticatedUser, deleteProduct)

module.exports = router;