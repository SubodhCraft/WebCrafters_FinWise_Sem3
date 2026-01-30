const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { sequelize } = require("../database/db");

async function createAdmin() {
  try {
    await sequelize.sync();

    const existingAdmin = await User.findOne({
      where: { email: "admin@finwise.com" },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      username: "admin",
      email: "admin@finwise.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
