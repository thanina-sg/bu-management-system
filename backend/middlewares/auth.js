const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_uha_2024';

/**
 * Vérifie si l'utilisateur est connecté (Token JWT valide)
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token manquant. Veuillez vous connecter." });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        // On attache les infos décodées (id, role) à l'objet req
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).json({ error: "Session expirée ou Token invalide." });
    }
};

/**
 * Vérifie si l'utilisateur a le rôle ADMINISTRATEUR
 */
const isAdmin = (req, res, next) => {
    // On regarde le rôle qui a été extrait du token par verifyToken
    if (req.user && (req.user.role === 'ADMINISTRATEUR' || req.user.role === 'ADMIN')) {
        next();
    } else {
        res.status(403).json({ 
            error: "Accès refusé : Cette action nécessite des droits d'administrateur." 
        });
    }
};

// --- LA LIGNE CRUCIALE ---
// Il faut exporter les DEUX fonctions pour qu'elles soient utilisables ailleurs
module.exports = { 
    verifyToken, 
    isAdmin 
};