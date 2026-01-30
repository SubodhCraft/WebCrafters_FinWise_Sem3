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

// Delete a goal
exports.deleteGoal = async (req, res) => {
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

    await goal.destroy();

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete goal',
      error: error.message
    });
  }
};

// Toggle goal active status
exports.toggleGoalStatus = async (req, res) => {
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

    await goal.update({ isActive: !goal.isActive });

    res.status(200).json({
      success: true,
      message: `Goal ${goal.isActive ? 'activated' : 'deactivated'} successfully`,
      data: goal.toJSON()
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to toggle goal status',
      error: error.message
    });
  }
};

// Get goals summary/statistics
exports.getGoalsSummary = async (req, res) => {
  try {
    const goals = await Goal.findAll({
      where: { userId: req.user.id }
    });

    const goalsWithVirtuals = goals.map(g => g.toJSON());

    const summary = {
      total: goals.length,
      active: goalsWithVirtuals.filter(g => g.status === 'active').length,
      completed: goalsWithVirtuals.filter(g => g.status === 'completed').length,
      expired: goalsWithVirtuals.filter(g => g.status === 'expired').length,
      income: {
        total: goals.filter(g => g.type === 'income').length,
        active: goalsWithVirtuals.filter(g => g.type === 'income' && g.status === 'active').length,
        completed: goalsWithVirtuals.filter(g => g.type === 'income' && g.status === 'completed').length
      },
      expense: {
        total: goals.filter(g => g.type === 'expense').length,
        active: goalsWithVirtuals.filter(g => g.type === 'expense' && g.status === 'active').length,
        completed: goalsWithVirtuals.filter(g => g.type === 'expense' && g.status === 'completed').length
      },
      totalTargetAmount: goals.reduce((sum, g) => sum + parseFloat(g.targetAmount || 0), 0),
      totalCurrentAmount: goals.reduce((sum, g) => sum + parseFloat(g.currentAmount || 0), 0),
      averageProgress: goals.length > 0
        ? goalsWithVirtuals.reduce((sum, g) => sum + g.progress, 0) / goals.length
        : 0
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch goals summary',
      error: error.message
    });
  }
};

// Sync goal progress with transactions
exports.syncGoalProgress = async (req, res) => {
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

    // Calculate actual amount from transactions
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
    await goal.update({ currentAmount: totalAmount });

    res.status(200).json({
      success: true,
      message: 'Goal progress synced successfully',
      data: goal.toJSON()
    });
  } catch (error) {
    console.error('Sync goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync goal progress',
      error: error.message
    });
  }
};

module.exports = exports;