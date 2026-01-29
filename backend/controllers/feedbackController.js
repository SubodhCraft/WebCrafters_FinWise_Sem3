const { Feedback, User } = require("../models");

// Create feedback (User only)
exports.createFeedback = async (req, res) => {
    try {
        const { message, rating } = req.body;
        const userId = req.user.id;

        if (!message) {
            return res.status(400).json({ success: false, message: "Feedback message is required" });
        }

        const feedback = await Feedback.create({
            userId,
            message,
            rating: rating || 5
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to submit feedback",
            error: error.message
        });
    }
};