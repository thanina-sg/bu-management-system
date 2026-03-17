const { registerUser, loginUser } = require('../models/authModel');

const register = async (req, res) => {
    const { email, nom, prenom, role, password } = req.body;

    try {
        const user = await registerUser(email, nom, prenom, role, password);

        res.status(201).json({ 
            message: "Succès : Utilisateur créé avec un mot de passe sécurisé !",
            user: { id: user.id, email: user.email, role: user.role } 
        });

    } catch (err) {
        console.error("Erreur Création:", err.message);
        res.status(400).json({ error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // IMPORTANT : loginUser renvoie { user, token }
        // On utilise la déstructuration pour récupérer les deux
        const { user, token } = await loginUser(email, password);
        
        // On renvoie TOUT au client
        res.json({ 
            message: "Connexion réussie !", 
            token: token, // Voilà ce qui manquait !
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            } 
        });

    } catch (err) {
        console.error("Erreur Login:", err.message);
        res.status(401).json({ error: "Identifiants invalides" });
    }
};

module.exports = {
    register,
    login
};