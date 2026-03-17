const supabase = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// IMPORTANT : Cette clé doit être EXACTEMENT la même dans ton middleware/auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_uha_2024';

/**
 * Inscription : Hachage du mot de passe et insertion en base
 */
const registerUser = async (email, nom, prenom, role, password) => {
    // 1. On sécurise le mot de passe
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 2. On insère dans la table 'utilisateur'
    const { data, error: dbError } = await supabase
        .from('utilisateur')
        .insert([{ 
            email, 
            nom, 
            prenom, 
            role: role || 'ETUDIANT',
            password_hash: password_hash 
        }])
        .select()
        .single();

    if (dbError) throw dbError;

    return data;
};

/**
 * Connexion : Vérification et génération du Token de session
 */
const loginUser = async (email, password) => {
    // 1. Récupérer l'utilisateur par son email
    const { data: user, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !user) throw new Error("Utilisateur non trouvé");

    // 2. Comparer le mot de passe fourni avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw new Error("Mot de passe incorrect");
    }

    // 3. GÉNÉRATION DU BADGE (TOKEN JWT)
    // On signe le token avec l'ID et le rôle de l'utilisateur
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '24h' }
    );

    // 4. On prépare l'objet de retour en supprimant le hash (sécurité)
    const { password_hash, ...userWithoutHash } = user;

    // On renvoie l'objet structuré pour le contrôleur
    return { 
        user: userWithoutHash, 
        token: token 
    };
};

module.exports = {
    registerUser,
    loginUser
};