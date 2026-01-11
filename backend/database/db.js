const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        logging: false,
        port: process.env.DB_PORT || 5432,
    }

);

const connectDB = async () => {
    try{
        await sequelize.authenticate();
        console.log(`PostgresSQL connected successfully: ${process.env.DB_NAME}`);

    }   catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }

};

module.exports={
    sequelize,
    connectDB,
};