const express = require('express');
const router = express.Router();
const { getAllBooks, getBook, getBookCopies, getBookRecommendations, createBook, modifyBook, removeBook } = require('../controllers/bookController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

// GET /api/books
router.get('/', getAllBooks);

// SPECIFIC ROUTES BEFORE GENERIC ONES

// GET /api/books/copies (all exemplaires)
router.get('/copies', async (req, res) => {
  const supabase = require('../db');
  try {
    const { data, error } = await supabase.from('exemplaire').select('*');
    if (error) throw error;
    console.log(`[/copies] Found ${data?.length || 0} exemplaires`);
    res.json(data || []);
  } catch (err) {
    console.error(`[/copies] Error:`, err);
    res.status(400).json({ error: err.message });
  }
});

// GET /api/books/:id/copies (copies for specific ISBN)
router.get('/:id/copies', getBookCopies);

// GET /api/books/:id/recommendations
router.get('/:id/recommendations', getBookRecommendations);

// GET /api/books/:id
router.get('/:id', getBook);

// POST /api/books
router.post('/', authenticateToken, requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), createBook);

// PUT /api/books/:id
router.put('/:id', authenticateToken, requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), modifyBook);

// DELETE /api/books/:id
router.delete('/:id', authenticateToken, requireRoles('ADMINISTRATEUR'), removeBook);

module.exports = router;
