const { getAllEmprunts } = require('../models/empruntModel');

const fetchEmprunts = async (req, res) => {
  try {
    const emprunts = await getAllEmprunts();
    res.json({ message: 'Liste des emprunts', data: emprunts });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les emprunts', detail: err.message });
  }
};

module.exports = {
  fetchEmprunts,
};
