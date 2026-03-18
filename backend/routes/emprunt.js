const express = require('express');
const router = express.Router();
const { getAllLoans, createNewLoan, returnBookLoan } = require('../controllers/empruntController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/loans
router.get('/', requireRoles('ETUDIANT', 'ENSEIGNANT', 'BIBLIOTHECAIRE', 'ADMINISTRATEUR'), getAllLoans);

// POST /api/loans
router.post('/', requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), createNewLoan);

// PUT /api/loans/:id/return
router.put('/:id/return', requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), returnBookLoan);

module.exports = router;
