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
// Get all feedbacks (Admin only)
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({
            include: [
                {
                    model: User,
                    attributes: ["username", "email"]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            success: true,
            data: feedbacks
        });
    } catch (error) {
        console.error("Get feedbacks error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch feedbacks",
            error: error.message
        });
    }
};

// Resolve feedback (Admin only)
exports.resolveFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        feedback.isResolved = !feedback.isResolved;
        await feedback.save();

        res.status(200).json({
            success: true,
            message: `Feedback marked as ${feedback.isResolved ? 'resolved' : 'unresolved'}`,
            data: feedback
        });
    } catch (error) {
        console.error("Resolve feedback error:", error);
        res.status(500).json({ success: false, message: "Failed to update feedback status" });
    }
};

// Delete feedback (Admin only)
exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByPk(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        await feedback.destroy();
        res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({ success: false, message: "Failed to delete feedback" });
    }
};