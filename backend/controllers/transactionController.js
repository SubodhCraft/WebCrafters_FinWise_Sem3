// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

// Create new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, category, amount, remarks, date } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!type || !category || !amount || !date) {
      return res.status(400).json({
        message: 'Type, category, amount, and date are required'
      });
    }

    // Validate transaction type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        message: 'Type must be either income or expense'
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId,
      type,
      category,
      amount: parseFloat(amount),
      remarks: remarks || null,
      date: new Date(date)
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({
      message: 'Failed to create transaction',
      error: error.message
    });
  }
};

// Get recent transactions (last 10)
exports.getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 10
    });

    res.status(200).json({
      transactions
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

// Get all transactions with pagination and filters
exports.getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { userId };

    if (type) whereClause.type = type;
    if (category) whereClause.category = category;

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date[Op.gte] = new Date(startDate);
      if (endDate) whereClause.date[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      transactions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};


// Get transaction statistics
exports.getTransactionStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total income
    const totalIncome = await Transaction.sum('amount', {
      where: { userId, type: 'income' }
    }) || 0;

    // Get total expenses
    const totalExpenses = await Transaction.sum('amount', {
      where: { userId, type: 'expense' }
    }) || 0;

    // Calculate balance
    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      balance: parseFloat(balance.toFixed(2)),
      income: parseFloat(totalIncome.toFixed(2)),
      expenses: parseFloat(totalExpenses.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};