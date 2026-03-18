const express = require('express');
const router = express.Router();
const { getAllBooks, getBook, getBookRecommendations, createBook, modifyBook, removeBook } = require('../controllers/bookController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

// GET /api/books
router.get('/', getAllBooks);

// GET /api/books/:id
router.get('/:id', getBook);

// GET /api/books/:id/recommendations
router.get('/:id/recommendations', getBookRecommendations);

// POST /api/books
router.post('/', authenticateToken, requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), createBook);

// PUT /api/books/:id
router.put('/:id', authenticateToken, requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), modifyBook);

// DELETE /api/books/:id
router.delete('/:id', authenticateToken, requireRoles('ADMINISTRATEUR'), removeBook);

module.exports = router;
