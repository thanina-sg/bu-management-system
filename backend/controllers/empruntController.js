const EmpruntModel = require('../models/empruntModel');

// POST /emprunts
const effectuerEmprunt = async (req, res) => {
  const { id_utilisateur, isbn } = req.body;

  try {
    if (!id_utilisateur || !isbn) {
      return res.status(400).json({ error: "Identifiant utilisateur ou ISBN manquant." });
    }

    // On récupère le résultat qui contient le 'type' (EMPRUNT ou RESERVATION)
    const resultat = await EmpruntModel.creerEmprunt(id_utilisateur, isbn);

    if (resultat.type === 'EMPRUNT') {
      // Cas : Un exemplaire était disponible
      return res.status(201).json({
        message: "Livre emprunté avec succès ! Vous avez 14 jours pour le rendre.",
        type: "EMPRUNT",
        data: resultat.data
      });
    } else {
      // Cas : Aucun exemplaire, création d'une réservation (202 = Accepted)
      return res.status(202).json({
        message: "Aucun exemplaire disponible. Vous avez été placé en file d'attente.",
        type: "RESERVATION",
        data: resultat.data
      });
    }

  } catch (error) {
    console.error("Erreur dans effectuerEmprunt:", error);
    res.status(500).json({ error: error.message });
  }
};

// GET /emprunts
const listerEmprunts = async (req, res) => {
  const { utilisateurId } = req.query;

  try {
    if (!utilisateurId) {
      return res.status(400).json({ error: "L'identifiant de l'utilisateur est requis." });
    }

    const emprunts = await EmpruntModel.getEmpruntsByUserId(utilisateurId);
    
    res.status(200).json(emprunts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  effectuerEmprunt,
  listerEmprunts
};