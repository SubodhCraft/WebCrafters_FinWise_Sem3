const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");
const { protect, admin } = require("../middleware/authMiddleware");

// User routes
router.post("/", protect, feedbackController.createFeedback);

// Admin routes
router.get("/", protect, admin, feedbackController.getAllFeedbacks);
router.patch("/:id/resolve", protect, admin, feedbackController.resolveFeedback);
router.delete("/:id", protect, admin, feedbackController.deleteFeedback);

module.exports = router;
