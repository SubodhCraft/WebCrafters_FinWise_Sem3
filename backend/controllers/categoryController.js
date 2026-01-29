// controllers/categoryController.js
const Category = require('../models/Category.js');
const { Op } = require("sequelize");

// Get all categories (grouped by type)
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const incomeCategories = await Category.findAll({
      where: {
        type: 'income',
        [Op.or]: [
          { createdBy: null },     // default categories
          { createdBy: userId }    // user-created categories
        ]
      },
      order: [['name', 'ASC']]
    });

    const expenseCategories = await Category.findAll({
      where: {
        type: 'expense',
        [Op.or]: [
          { createdBy: null },
          { createdBy: userId }
        ]
      },
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      incomeCategories,
      expenseCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      message: 'Failed to fetch categories',
      error: error.message 
    });
  }
};


// Create new category (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;
    const createdBy = req.user.id;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ 
        message: 'Name and type are required' 
      });
    }

    // Validate type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ 
        message: 'Type must be either income or expense' 
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      where: { name, type }
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: 'Category already exists' 
      });
    }

    const category = await Category.create({
      name,
      type,
      createdBy
    });

    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      message: 'Failed to create category',
      error: error.message 
    });
  }
};