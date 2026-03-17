const { getLoans, createLoan, returnLoan } = require('../models/empruntModel');

const getAllLoans = async (req, res) => {
    try {
        const filters = {
            studentId: req.query.studentId,
            status: req.query.status
        };

        const loans = await getLoans(filters);
        res.json(loans);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createNewLoan = async (req, res) => {
    try {
        const { studentId, isbn, loanDate, returnDateExpected } = req.body;

        const loan = await createLoan(studentId, isbn, returnDateExpected);
        res.status(201).json(loan);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const returnBookLoan = async (req, res) => {
    try {
        const { returnDateActual } = req.body;

        const result = await returnLoan(req.params.id, returnDateActual);
        res.json(result);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAllLoans,
    createNewLoan,
    returnBookLoan
};
