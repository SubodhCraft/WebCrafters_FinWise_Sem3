const { sequelize } = require('../database/db');
const User = require('./userModel');
const SecurityQuestion = require('./securityQuestion');
const Transaction = require('./Transaction');
const Category = require('./Category');
const SelfNote = require('./SelfNote');
const Goal = require('./goalsModel');
const Feedback = require('./Feedback');

// Define associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Feedback, { foreignKey: 'userId' });
Feedback.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    SecurityQuestion,
    Transaction,
    Category,
    SelfNote,
    Goal,
    Feedback
};
