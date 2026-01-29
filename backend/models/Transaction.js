const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;