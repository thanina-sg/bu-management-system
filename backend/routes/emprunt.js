const express = require('express');
const router = express.Router();
const { getAllLoans, createNewLoan, returnBookLoan } = require('../controllers/empruntController');

// GET /api/loans
router.get('/', getAllLoans);

// POST /api/loans
router.post('/', createNewLoan);

// PUT /api/loans/:id/return
router.put('/:id/return', returnBookLoan);

module.exports = router;
