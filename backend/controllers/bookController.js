const BookModel = require('../models/bookModel');

// Pour la liste filtrée
const getBooks = async (req, res) => {
    try {
        const filters = {
            search: req.query.search || null,
            categorie: req.query.categorie || null,
            sortBy: req.query.sort || null
        };
        const books = await BookModel.getAllBooks(filters);
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Pour la disponibilité unitaire
const getStock = async (req, res) => {
    try {
        const { isbn } = req.params;
        const stock = await BookModel.getDisponibiliteByIsbn(isbn);
        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getBooks, getStock };