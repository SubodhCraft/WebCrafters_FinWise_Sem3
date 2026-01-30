const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel");
const SecurityQuestion = require("../models/securityQuestion");

// Save security questions after registration
exports.saveSecurityQuestions = async (req, res) => {
  try {
    const { userId, questions } = req.body;

    // Validate input
    if (!userId || !questions || questions.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "User ID and 3 security questions are required",
      });
    }

    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if security questions already exist
    const existing = await SecurityQuestion.findOne({ where: { userId } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Security questions already set for this user",
      });
    }

    // Hash the answers for security
    const hashedAnswers = await Promise.all(
      questions.map((q) => bcrypt.hash(q.answer.toLowerCase().trim(), 10))
    );

    // Create security questions
    const securityQuestion = await SecurityQuestion.create({
      userId,
      question1: questions[0].question,
      answer1: hashedAnswers[0],
      question2: questions[1].question,
      answer2: hashedAnswers[1],
      question3: questions[2].question,
      answer3: hashedAnswers[2],
    });

    res.status(201).json({
      success: true,
      message: "Security questions saved successfully",
      data: {
        id: securityQuestion.id,
        userId: securityQuestion.userId,
      },
    });
  } catch (error) {
    console.error("Error saving security questions:", error);
    res.status(500).json({
      success: false,
      message: "Error saving security questions",
      error: error.message,
    });
  }
};

// Get security questions for a user (by email for forgot password)
exports.getSecurityQuestions = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const securityQuestions = await SecurityQuestion.findOne({
      where: { userId: user.id },
      attributes: ["question1", "question2", "question3"],
    });

    if (!securityQuestions) {
      return res.status(404).json({
        success: false,
        message: "Security questions not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user.id,
        questions: [
          securityQuestions.question1,
          securityQuestions.question2,
          securityQuestions.question3,
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching security questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching security questions",
      error: error.message,
    });
  }
};

// Verify security question answers
exports.verifySecurityAnswers = async (req, res) => {
  try {
    const { email, answers } = req.body;

    if (!email || !answers || answers.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Email and 3 answers are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const securityQuestions = await SecurityQuestion.findOne({
      where: { userId: user.id },
    });

    if (!securityQuestions) {
      return res.status(404).json({
        success: false,
        message: "Security questions not found",
      });
    }

    // Verify all answers
    const answer1Match = await bcrypt.compare(
      answers[0].toLowerCase().trim(),
      securityQuestions.answer1
    );
    const answer2Match = await bcrypt.compare(
      answers[1].toLowerCase().trim(),
      securityQuestions.answer2
    );
    const answer3Match = await bcrypt.compare(
      answers[2].toLowerCase().trim(),
      securityQuestions.answer3
    );

    if (answer1Match && answer2Match && answer3Match) {
      // Generate a temporary token for password reset
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenHash = await bcrypt.hash(resetToken, 10);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      await user.update({
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: resetTokenExpiry,
      });

      res.status(200).json({
        success: true,
        message: "Answers verified successfully",
        data: {
          resetToken,
          userId: user.id,
        },
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Incorrect answers. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error verifying answers:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying answers",
      error: error.message,
    });
  }
};

// Reset password after verification
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    // Find user with valid reset token
    const users = await User.findAll({
      where: {
        resetPasswordExpires: {
          [require("sequelize").Op.gt]: new Date(),
        },
      },
    });

    let user = null;
    for (const u of users) {
      if (u.resetPasswordToken) {
        const isValid = await bcrypt.compare(resetToken, u.resetPasswordToken);
        if (isValid) {
          user = u;
          break;
        }
      }
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};