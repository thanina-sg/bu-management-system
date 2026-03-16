const { getAllBooks } = require('../models/bookModel');

const getBooks = async (req, res) => {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getBooks
};
