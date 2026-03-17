const UserModel = require('../models/userModel');

/**
 * GET /api/users
 * Récupère la liste de tous les utilisateurs (pour l'admin)
 */
const fetchUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    
    // Le Model gère déjà le calcul du statut "EMPRUNTEUR" 
    // et le renommage des champs pour le Swagger.
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ 
      error: 'Impossible de récupérer les utilisateurs', 
      detail: err.message 
    });
  }
};

/**
 * GET /api/users/me
 * Profil de l'utilisateur connecté (via Token JWT)
 */
const fetchMe = async (req, res) => {
  try {
    // Sécurité : on vérifie que le middleware d'auth a bien injecté l'user
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non identifié. Token manquant ou invalide." });
    }

    const user = await UserModel.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable dans la base de données." });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erreur lors de la récupération du profil', 
      detail: err.message 
    });
  }
};

module.exports = {
  fetchUsers,
  fetchMe
};