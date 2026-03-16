const { registerUser, loginUser } = require('../models/authModel');

const register = async (req, res) => {
    const { email, nom, prenom, role } = req.body;

    try {
        const user = await registerUser(email, nom, prenom, role);

        res.status(201).json({ 
            message: "Succès : Utilisateur créé directement dans la base de données !",
            user: user
        });

    } catch (err) {
        console.error("Erreur Création:", err.message);
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await loginUser(email);
        res.json({ message: "Connexion réussie (Simulation sans email)", user: user });

    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

module.exports = {
    register,
    login
};
