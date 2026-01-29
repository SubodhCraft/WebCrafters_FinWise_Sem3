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
