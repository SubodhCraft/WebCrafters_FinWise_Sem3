// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const authGuard = require('../helpers/authGuard');
const {
  createTransaction,
  getRecentTransactions,
  getAllTransactions,
  getTransactionStats,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
  getAnalyticsByCategory,
  getMonthlyTrends,
  getTransactionsByMonth
} = require('../controllers/transactionController');

// All routes require authentication
router.use(authGuard);

// Transaction routes
router.post('/', createTransaction);
router.get('/recent', getRecentTransactions);
router.get('/stats', getTransactionStats);
router.get('/date-range', getTransactionsByDateRange);
router.get('/analytics/category', getAnalyticsByCategory);
router.get('/analytics/trends', getMonthlyTrends);
router.get('/calendar', getTransactionsByMonth);
router.get('/', getAllTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;