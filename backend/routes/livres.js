const express = require('express');
const router = express.Router();
const { getAllBooks, getBook, getBookRecommendations, createBook, modifyBook, removeBook } = require('../controllers/bookController');

// GET /api/books
router.get('/', getAllBooks);

// GET /api/books/:id
router.get('/:id', getBook);

// GET /api/books/:id/recommendations
router.get('/:id/recommendations', getBookRecommendations);

// POST /api/books
router.post('/', createBook);

// PUT /api/books/:id
router.put('/:id', modifyBook);

// DELETE /api/books/:id
router.delete('/:id', removeBook);

module.exports = router;
