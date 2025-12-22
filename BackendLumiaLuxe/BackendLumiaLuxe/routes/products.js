const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview
} = require('../Controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), uploadProductImages, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.post('/:id/reviews', protect, addReview);

module.exports = router;