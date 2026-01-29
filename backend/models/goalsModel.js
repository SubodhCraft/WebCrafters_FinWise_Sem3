const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  targetAmount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currentAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  period: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly', 'custom'),
    defaultValue: 'monthly'
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfterStart(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(7),
    defaultValue: '#4CAF50',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  icon: {
    type: DataTypes.STRING(50),
    defaultValue: 'target'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificationEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notificationThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 80,
    validate: {
      min: 0,
      max: 100
    }
  }
}, {
  tableName: 'goals',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'isActive']
    },
    {
      fields: ['userId', 'type']
    },
    {
      fields: ['endDate']
    }
  ]
});

module.exports = Goal;

// Virtual fields
Goal.prototype.getProgress = function () {
  if (this.targetAmount === 0) return 0;
  return Math.min((parseFloat(this.currentAmount) / parseFloat(this.targetAmount)) * 100, 100);
};

Goal.prototype.getRemainingAmount = function () {
  return Math.max(parseFloat(this.targetAmount) - parseFloat(this.currentAmount), 0);
};

Goal.prototype.getStatus = function () {
  const now = new Date();
  if (!this.isActive) return 'inactive';
  if (now > this.endDate) return 'expired';
  if (parseFloat(this.currentAmount) >= parseFloat(this.targetAmount)) return 'completed';
  return 'active';
};

// Instance method to get full goal data with virtuals
Goal.prototype.toJSON = function () {
  const values = { ...this.get() };
  values.progress = this.getProgress();
  values.remainingAmount = this.getRemainingAmount();
  values.status = this.getStatus();
  return values;
};