// models/Category.js
const { DataTypes } = require('sequelize');
const {sequelize }= require('../database/db');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Null for default/admin categories'
  }
}, {
  tableName: 'categories',
  timestamps: true
});

module.exports = Category;