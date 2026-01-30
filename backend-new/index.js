// const express = require("express");
// const {connectDB} = require("./database/db");

// const app = express();
// const { sequelize, connectDB } = require("./database/db");

// const authRoutes = require("./routes/authRoutes");
// const securityQuestionRoutes = require("./routes/securityQuestionRoutes");

// const cors = require("cors");
// require("dotenv").config();

// // MIDDLEWARE (MUST COME FIRST)
// app.use(cors({
//   origin: "http://localhost:5173", // frontend port
//   credentials: true
// }));

// const transactionRoutes = require('./routes/transactionRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');
// const userRoutes = require('./routes/userRoutes');

// // Routes
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS - UNCOMMENT THIS! (CRITICAL FIX #1)


// // Or without installing cors package:
// // app.use((req, res, next) => {
// //   res.header('Access-Control-Allow-Origin', '*');
// //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// //   res.header('Access-Control-Allow-Headers', 'Content-Type');
// //   next();
// // });

// // ROUTES

// app.use("/api/auth", authRoutes);
// app.use("/api/security", securityQuestionRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/user', userRoutes);
//   // Fixed: removed trailing slash and require()

// // Health check endpoint
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the Home Page" });
// });

// // DATABASE & START SERVER
// const startServer = async () => {
//   try {
//     await connectDB();
//     await sequelize.sync();
//     console.log('Database connected and synced');

//     // CRITICAL FIX #2: Changed port from 3000 to 5000
//     const PORT = process.env.PORT || 5000;

//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//       console.log(`Register endpoint: http://localhost:${PORT}/api/auth/register`);
//       console.log(`Login endpoint: http://localhost:${PORT}/api/auth/login`);
//     });
//   } catch (err) {
//     console.error('Server startup failed:', err);
//     process.exit(1);
//   }
// };

// startServer();






const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize, connectDB } = require("./database/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const securityQuestionRoutes = require("./routes/securityQuestionRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const selfNoteRoutes = require("./routes/selfNoteRoutes");
const goalRoutes = require("./routes/goalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// const userRoutes = require("./routes/userRoutes");

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static('uploads'));


/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/security", securityQuestionRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/selfnotes", selfNoteRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER_ERROR_DETECTED:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.stack
  });
});

// app.use("/api/user", userRoutes);

/* =======================
   HEALTH CHECK
======================= */
// [INTEGRATED TESTING NODE]
// Basic heartbeat check for the ecosystem. Referenced in various tests.
app.get("/", (req, res) => {
  res.json({ message: "Backend is running successfully 🚀" });
});


const bcrypt = require("bcrypt");
const { User, Category } = require("./models");

/* =======================
   START SERVER
======================= */
const createAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({
      where: { email: "admin@finwise.com" },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await User.create({
      username: "admin",
      email: "admin@finwise.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully");
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};

const seedCategories = async () => {
  try {
    const defaultCategories = [
      // Income categories
      { name: 'Salary', type: 'income', createdBy: null },
      { name: 'Freelance', type: 'income', createdBy: null },
      { name: 'Investment', type: 'income', createdBy: null },
      { name: 'Business', type: 'income', createdBy: null },
      { name: 'Gift', type: 'income', createdBy: null },
      { name: 'Bonus', type: 'income', createdBy: null },
      { name: 'Other Income', type: 'income', createdBy: null },

      // Expense categories
      { name: 'Groceries', type: 'expense', createdBy: null },
      { name: 'Shopping', type: 'expense', createdBy: null },
      { name: 'Bills', type: 'expense', createdBy: null },
      { name: 'Healthcare', type: 'expense', createdBy: null },
      { name: 'Transportation', type: 'expense', createdBy: null },
      { name: 'Entertainment', type: 'expense', createdBy: null },
      { name: 'Education', type: 'expense', createdBy: null },
      { name: 'Food & Dining', type: 'expense', createdBy: null },
      { name: 'Utilities', type: 'expense', createdBy: null },
      { name: 'Rent', type: 'expense', createdBy: null },
      { name: 'Insurance', type: 'expense', createdBy: null },
      { name: 'Clothing', type: 'expense', createdBy: null },
      { name: 'Personal Care', type: 'expense', createdBy: null },
      { name: 'Other Expense', type: 'expense', createdBy: null }
    ];

    const existingCount = await Category.count();

    if (existingCount > 0) {
      console.log('Categories already exist. Skipping seed.');
      return;
    }

    await Category.bulkCreate(defaultCategories);
    console.log('Default categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
};

const startServer = async () => {
  try {
    await connectDB();              // DB authentication
    await sequelize.sync({ alter: true });         // Model sync
    console.log("Database connected & synced");

    // Initialize required data
    await createAdmin();
    await seedCategories();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

// Triggering restart for Local Storage fallback fix
startServer();
