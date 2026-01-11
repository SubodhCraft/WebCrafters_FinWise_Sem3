const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
const User = require("./userModel");

const SecurityQuestion = sequelize.define(
  "SecurityQuestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    question1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    question3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "security_questions",
    timestamps: true,
  }
);

// Define associations
SecurityQuestion.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasOne(SecurityQuestion, {
  foreignKey: "userId",
  as: "securityQuestions",
});

module.exports = SecurityQuestion;