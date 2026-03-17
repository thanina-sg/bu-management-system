const express = require('express');
const router = express.Router();

// Importation de toutes les méthodes du controller
const { 
    getBooks, 
    getBookById, 
    getStock, 
    create, 
    update, 
    remove 
} = require('../controllers/bookController');

/**
 * ROUTES POUR LE CATALOGUE (/api/books)
 */

// Route 1 : Liste globale avec filtres (ex: GET /api/books?search=potter)
router.get('/', getBooks);

// Route 2 : Détails d'un livre précis (ex: GET /api/books/9782070415793)
router.get('/:isbn', getBookById);

// Route 3 : Stock et disponibilité précise (ex: GET /api/books/9782070415793/dispo)
router.get('/:isbn/dispo', getStock);

// Route 4 : Ajouter un livre (ex: POST /api/books)
// Note: Dans une version finale, on ajouterait ici un middleware d'auth Staff
router.post('/', create);

// Route 5 : Modifier un livre (ex: PUT /api/books/9782070415793)
// Note: Utilisé par le BooksPanel pour l'édition inline
router.put('/:isbn', update);

// Route 6 : Supprimer un livre (ex: DELETE /api/books/9782070415793)
// Note: Réservé à l'Admin
router.delete('/:isbn', remove);

module.exports = router;