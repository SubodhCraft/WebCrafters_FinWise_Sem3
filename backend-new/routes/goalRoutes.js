const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const authGuard = require('../helpers/authGuard');

// All routes require authentication
router.use(authGuard);

// Goal CRUD operations
router.post('/', goalController.createGoal);
router.get('/', goalController.getAllGoals);
router.get('/summary', goalController.getGoalsSummary);
router.get('/:id', goalController.getGoalById);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);

// Additional operations
router.patch('/:id/progress', goalController.updateGoalProgress);
router.patch('/:id/toggle', goalController.toggleGoalStatus);
router.post('/:id/sync', goalController.syncGoalProgress);

module.exports = router;
