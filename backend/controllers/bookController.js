const { getAllBooks } = require('../models/bookModel');

const getBooks = (req, res) => {
    try {
        const books = getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getBooks
};
