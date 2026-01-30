const { Goal, Transaction } = require('../models');
const { Op } = require('sequelize');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    const {
      type,
      title,
      targetAmount,
      category,
      period,
      startDate,
      endDate,
      description,
      color,
      icon,
      notificationEnabled,
      notificationThreshold
    } = req.body;

    const goal = await Goal.create({
      userId: req.user.id,
      type,
      title,
      targetAmount,
      category,
      period,
      startDate: startDate || new Date(),
      endDate,
      description,
      color,
      icon,
      notificationEnabled,
      notificationThreshold
    });

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create goal',
      error: error.message
    });
  }
};

// Get all goals for a user
exports.getAllGoals = async (req, res) => {
  try {
    const { type, isActive, status } = req.query;

    const where = { userId: req.user.id };

    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive === 'true';

    const goals = await Goal.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    // Sync progress for active goals
    for (const goal of goals) {
      if (goal.isActive) {
        const transactions = await Transaction.findAll({
          where: {
            userId: req.user.id,
            category: goal.category,
            type: goal.type,
            date: {
              [Op.between]: [goal.startDate, goal.endDate]
            }
          }
        });
        const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        if (parseFloat(goal.currentAmount) !== totalAmount) {
          await goal.update({ currentAmount: totalAmount });
        }
      }
    }

    // Filter by status if provided (since status is virtual)
    let filteredGoals = goals;
    if (status) {
      filteredGoals = goals.filter(goal => goal.getStatus() === status);
    }

    // Convert to JSON to include virtuals
    const goalsWithVirtuals = filteredGoals.map(goal => goal.toJSON());

    res.status(200).json({
      success: true,
      count: goalsWithVirtuals.length,
      data: goalsWithVirtuals
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals',
      error: error.message
    });
  }
};

// Get a single goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.status(200).json({
      success: true,
      data: goal.toJSON()
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goal',
      error: error.message
    });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    await goal.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal.toJSON()
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update goal',
      error: error.message
    });
  }
};

// Update goal progress (current amount)
exports.updateGoalProgress = async (req, res) => {
  try {
    const { currentAmount } = req.body;

    const goal = await Goal.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    await goal.update({ currentAmount });

    res.status(200).json({
      success: true,
      message: 'Goal progress updated successfully',
      data: goal.toJSON()
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update goal progress',
      error: error.message
    });
  }
};