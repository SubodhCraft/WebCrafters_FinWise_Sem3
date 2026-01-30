const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Feedback = sequelize.define(
    "Feedback",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5,
            },
        },
        isResolved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "feedbacks",
        timestamps: true,
    }
);

module.exports = Feedback;
