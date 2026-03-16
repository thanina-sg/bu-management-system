const express = require('express');
const router = express.Router();
const { getBooks } = require('../controllers/bookController');

// Route : GET /livres
router.get('/', getBooks);

module.exports = router;