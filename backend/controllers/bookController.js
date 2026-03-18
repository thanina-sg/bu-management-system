const { getBooks, getBookById, getRecommendations, addBook, updateBook, deleteBook } = require('../models/bookModel');
const supabase = require('../db');

const getAllBooks = async (req, res) => {
    try {
        const filters = {
            search: req.query.q || req.query.search,
            category: req.query.categorie || req.query.category,
            disponible: req.query.disponible,
        };

        const books = await getBooks(filters);
        res.json(books);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getBook = async (req, res) => {
    try {
        const book = await getBookById(req.params.id);
        res.json(book);

    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const getBookCopies = async (req, res) => {
    try {
        const isbn = req.params.id;
        console.log(`[getBookCopies] Looking for copies with ISBN: ${isbn}`);
        
        const { data, error } = await supabase
            .from('exemplaire')
            .select('id_exemplaire, isbn, etat, localisation, disponibilite')
            .eq('isbn', isbn);

        if (error) throw error;
        
        console.log(`[getBookCopies] Found ${data?.length || 0} copies for ${isbn}`);
        res.json(data || []);

    } catch (err) {
        console.error(`[getBookCopies] Error:`, err.message);
        res.status(400).json({ error: err.message });
    }
};

const getBookRecommendations = async (req, res) => {
    try {
        const recommendations = await getRecommendations(req.params.id);
        res.json(recommendations);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createBook = async (req, res) => {
    try {
        const book = await addBook(req.body);
        res.status(201).json(book);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const modifyBook = async (req, res) => {
    try {
        const book = await updateBook(req.params.id, req.body);
        res.json(book);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const removeBook = async (req, res) => {
    try {
        await deleteBook(req.params.id);
        res.sendStatus(204);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBook,
    getBookCopies,
    getBookRecommendations,
    createBook,
    modifyBook,
    removeBook
};
