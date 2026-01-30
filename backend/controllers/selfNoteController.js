// controllers/selfNoteController.js
const SelfNote = require('../models/SelfNote');
const { Op } = require('sequelize');

// Create new self note
exports.createSelfNote = async (req, res) => {
  try {
    const { title, description, color } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and description are required' 
      });
    }

    // Create self note
    const selfNote = await SelfNote.create({
      userId,
      title,
      description,
      color: color || '#7B61FF',
      isPinned: false
    });

    res.status(201).json({
      success: true,
      message: 'Self note created successfully',
      note: selfNote
    });
  } catch (error) {
    console.error('Error creating self note:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create self note',
      error: error.message 
    });
  }
};

// Get all self notes for user
exports.getAllSelfNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = { userId };
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await SelfNote.findAndCountAll({
      where: whereClause,
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      notes: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching self notes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch self notes',
      error: error.message 
    });
  }
};

// Get recent self notes (last 10)
exports.getRecentSelfNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await SelfNote.findAll({
      where: { userId },
      order: [
        ['isPinned', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 10
    });

    res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Error fetching recent self notes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch recent self notes',
      error: error.message 
    });
  }
};

// Get single self note by ID
exports.getSelfNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await SelfNote.findOne({
      where: { id, userId }
    });

    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Self note not found' 
      });
    }

    res.status(200).json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Error fetching self note:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch self note',
      error: error.message 
    });
  }
};