const express = require('express');
const router = express.Router();
// On importe les deux fonctions
const { effectuerEmprunt, listerEmprunts } = require('../controllers/empruntController');

// Route pour créer un emprunt
router.post('/', effectuerEmprunt);

// Route pour lister les emprunts (C'est celle-ci qui manquait !)
router.get('/', listerEmprunts);

module.exports = router;