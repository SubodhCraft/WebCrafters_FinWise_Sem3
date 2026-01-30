const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All admin routes are protected and require admin role
router.use(protect);
router.use(admin);

router.get("/stats", adminController.getDashboardStats);
router.get("/category-stats", adminController.getCategoryStats);
router.get("/users", adminController.getAllUsers);
router.delete("/users/:id", adminController.deleteUser);
router.patch("/users/:id/role", adminController.toggleUserRole);

module.exports = router;
