const { getAllBooks } = require('../models/bookModel');

const getBooks = async (req, res) => {
    try {
        // On extrait les paramètres de la query string (ex: ?search=...&sort=...)
        const filters = {
            search: req.query.search || null,
            categorie: req.query.categorie || null,
            sortBy: req.query.sort || null
        };

        const books = await getAllBooks(filters);
        
        res.status(200).json(books);
    } catch (err) {
        console.error("Erreur dans getBooks:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getBooks
};