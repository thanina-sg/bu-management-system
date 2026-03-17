const express = require('express');
const router = express.Router();
const { getBooks, getStock } = require('../controllers/bookController');

// Route 1 : Liste et filtres (ex: /api/books?search=potter)
router.get('/', getBooks);

// Route 2 : Dispo précise (ex: /api/books/9782070415793/dispo)
router.get('/:isbn/dispo', getStock);

module.exports = router;