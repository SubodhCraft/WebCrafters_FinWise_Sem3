// routes/selfNoteRoutes.js
const express = require('express');
const router = express.Router();
const authGuard = require('../helpers/authGuard');
const {
  createSelfNote,
  getAllSelfNotes,
  getRecentSelfNotes,
  getSelfNoteById,
  updateSelfNote,
  togglePinSelfNote,
  deleteSelfNote,
  getSelfNotesCount
} = require('../controllers/selfNoteController');

// All routes require authentication
router.use(authGuard);

// Self note routes
router.post('/', createSelfNote);
router.get('/recent', getRecentSelfNotes);
router.get('/count', getSelfNotesCount);
router.get('/', getAllSelfNotes);
router.get('/:id', getSelfNoteById);
router.put('/:id', updateSelfNote);
router.patch('/:id/pin', togglePinSelfNote);
router.delete('/:id', deleteSelfNote);

module.exports = router;