const EmpruntModel = require('../models/empruntModel');

const getLoans = async (req, res) => {
    try {
        // --- SÉCURITÉ ANTI-CRASH ---
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Identification utilisateur impossible. Vérifiez votre Token." });
        }

        const utilisateurId = req.user.id;
        const loans = await EmpruntModel.getEmpruntsByUserId(utilisateurId);
        
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des emprunts", detail: err.message });
    }
};

const createLoan = async (req, res) => {
    const { isbn } = req.body;
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "Action impossible sans authentification." });
        }

        const result = await EmpruntModel.creerEmprunt(req.user.id, isbn);
        const status = result.type === 'EMPRUNT' ? 201 : 202;
        res.status(status).json(result);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création", detail: err.message });
    }
};

const returnLoan = async (req, res) => {
    const { id } = req.params; // ID de l'emprunt
    const { returnDateActual } = req.body;
    try {
        const updated = await EmpruntModel.enregistrerRetour(id, returnDateActual);
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors du retour", detail: err.message });
    }
};

module.exports = { getLoans, createLoan, returnLoan };