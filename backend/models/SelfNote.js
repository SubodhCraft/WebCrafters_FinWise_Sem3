const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/db');

const SelfNote = sequelize.define('SelfNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  isPinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#7B61FF',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  }
}, {
  tableName: 'self_notes',
  timestamps: true
});

module.exports = SelfNote