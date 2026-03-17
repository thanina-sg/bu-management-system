const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const { getLoans, createLoan, returnLoan } = require('../controllers/empruntController');

// Toutes les routes d'emprunt nécessitent d'être connecté
// On peut aussi utiliser router.use(verifyToken) en haut du fichier pour faire court.

// GET /api/loans -> Récupère MES emprunts
router.get('/', verifyToken, getLoans);

// POST /api/loans -> Créer un emprunt ou une résa
router.post('/', verifyToken, createLoan);

// PUT /api/loans/:id/return -> Rendre un livre
router.put('/:id/return', verifyToken, returnLoan);

module.exports = router;