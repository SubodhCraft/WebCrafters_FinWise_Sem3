const express = require("express");
const app = express();
const { sequelize, connectDB } = require("./database/db");

const authRoutes = require("./routes/authRoutes");
const securityQuestionRoutes = require("./routes/securityQuestionRoutes");

const cors = require("cors");
require("dotenv").config();

// MIDDLEWARE (MUST COME FIRST)
app.use(cors({
  origin: "http://localhost:5173", // frontend port
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - UNCOMMENT THIS! (CRITICAL FIX #1)


// Or without installing cors package:
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// ROUTES

app.use("/api/auth", authRoutes);
app.use("/api/security", securityQuestionRoutes);
  // Fixed: removed trailing slash and require()

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Home Page" });
});

// DATABASE & START SERVER
const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();
    console.log('Database connected and synced');
    
    // CRITICAL FIX #2: Changed port from 3000 to 5000
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Register endpoint: http://localhost:${PORT}/api/auth/register`);
      console.log(`Login endpoint: http://localhost:${PORT}/api/auth/login`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
};

startServer();