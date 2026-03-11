const express = require('express');
const router = express.Router();
const supabase = require('../db');

// --- 1. REGISTER (Test de création directe en base) ---
router.post('/register', async (req, res) => {
    const { email, nom, prenom, role } = req.body;

    try {
        const { data, error: dbError } = await supabase
            .from('utilisateur')
            .insert([{ 
                email, 
                nom, 
                prenom, 
                role: role || 'ETUDIANT'
            }])
            .select(); 

        if (dbError) throw dbError;

        res.status(201).json({ 
            message: "Succès : Utilisateur créé directement dans la base de données !",
            user: data[0]
        });

    } catch (err) {
        console.error("Erreur Création:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// --- 2. LOGIN (Simulé pour test) ---
router.post('/login', async (req, res) => {
    const { email } = req.body;

    try {
        // On vérifie simplement si l'utilisateur existe dans la table
        const { data, error } = await supabase
            .from('utilisateur')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) throw new Error("Utilisateur non trouvé");

        res.json({ message: "Connexion réussie (Simulation sans email)", user: data });

    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;