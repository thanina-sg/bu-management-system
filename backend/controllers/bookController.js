const BookModel = require('../models/bookModel');

// GET /api/books (Liste + Filtres)
const getBooks = async (req, res) => {
    try {
        const filters = {
            // On aligne sur les noms exacts du Swagger
            search: req.query.search || req.query.q || null, 
            categorie: req.query.categorie || req.query.category || null,
            sortBy: req.query.sort || null
        };
        const books = await BookModel.getAllBooks(filters);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/books/:isbn (Détails d'un livre)
const getBookById = async (req, res) => {
    try {
        const { isbn } = req.params; // On utilise isbn car c'est la clé primaire SQL
        const book = await BookModel.getBookByIsbn(isbn); 
        if (!book) return res.status(404).json({ error: "Livre non trouvé" });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/books (Création)
const create = async (req, res) => {
    try {
        // Sécurité : On s'assure que resume est bien présent 
        // même si le client envoie par erreur 'description'
        const bookData = {
            ...req.body,
            resume: req.body.resume || req.body.description 
        };

        const newBook = await BookModel.createBook(bookData);
        res.status(201).json(newBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/books/:isbn (Mise à jour)
const update = async (req, res) => {
    try {
        const { isbn } = req.params;
        
        // On gère aussi le mapping ici pour la cohérence
        const updatedData = {
            ...req.body,
            resume: req.body.resume || req.body.description
        };

        const updatedBook = await BookModel.updateBook(isbn, updatedData);
        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/books/:isbn
const remove = async (req, res) => {
    try {
        const { isbn } = req.params;
        await BookModel.deleteBook(isbn);
        res.status(204).send(); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/books/:isbn/dispo
const getStock = async (req, res) => {
    try {
        const { isbn } = req.params;
        const stock = await BookModel.getDisponibiliteByIsbn(isbn);
        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { 
    getBooks, 
    getBookById, 
    create, 
    update, 
    remove, 
    getStock 
};