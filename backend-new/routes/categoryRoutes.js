// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');

const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Get all categories (protected route)
router.get('/', protect, getAllCategories);

// Admin only routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;