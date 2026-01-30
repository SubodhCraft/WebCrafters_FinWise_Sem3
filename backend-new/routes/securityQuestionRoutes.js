// routes/securityQuestionRoutes.js
const express = require('express');
const router = express.Router();
const securityQuestionController = require('../controllers/securityQuestionController');

// Save security questions after registration
router.post('/save', securityQuestionController.saveSecurityQuestions);

// Get security questions by email (for forgot password flow)
router.get('/questions/:email', securityQuestionController.getSecurityQuestions);

// Verify security answers
router.post('/verify', securityQuestionController.verifySecurityAnswers);

// Reset password
router.post('/reset-password', securityQuestionController.resetPassword);

module.exports = router;