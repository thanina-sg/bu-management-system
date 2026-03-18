const { getLoans, createLoan, returnLoan } = require('../models/empruntModel');

const getAllLoans = async (req, res) => {
    try {
        const currentRole = req.user?.role;
        const currentUserId = req.user?.id;

        const filters = {
            studentId: req.query.id_utilisateur,
            status: req.query.statut,
        };

        if (
            currentRole !== 'BIBLIOTHECAIRE' &&
            currentRole !== 'ADMINISTRATEUR'
        ) {
            filters.studentId = currentUserId;
        }

        const loans = await getLoans(filters);
        res.json(loans);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createNewLoan = async (req, res) => {
    try {
        const { id_utilisateur, isbn, date_retour_prevue } = req.body;

        const loan = await createLoan(id_utilisateur, isbn, date_retour_prevue);
        res.status(201).json(loan);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const returnBookLoan = async (req, res) => {
    try {
        const { date_retour_reelle } = req.body;

        const result = await returnLoan(req.params.id, date_retour_reelle);
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
