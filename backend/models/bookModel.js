const pool = require('../db'); // Assure-toi que ce chemin pointe vers ta config PG

const getAllBooks = async (filters = {}) => {
    const { search, categorie, sortBy } = filters;
    
    // Initialisation de la requête
    // On sélectionne tout de livre + on vérifie s'il existe un exemplaire dispo
    let query = `
        SELECT l.*, 
        EXISTS (
            SELECT 1 FROM exemplaire e 
            WHERE e.isbn = l.isbn AND e.disponibilite = true
        ) as est_disponible
        FROM livre l
        WHERE 1=1
    `;
    
    const values = [];

    // Filtre de recherche (Titre, Auteur ou ISBN)
    if (search) {
        values.push(`%${search}%`);
        query += ` AND (l.titre ILIKE $${values.length} OR l.auteur ILIKE $${values.length} OR l.isbn ILIKE $${values.length})`;
    }

    // Filtre par catégorie
    if (categorie) {
        values.push(categorie);
        query += ` AND l.categorie = $${values.length}`;
    }

    // Logique de tri
    if (sortBy === 'auteur') {
        query += ` ORDER BY l.auteur ASC`;
    } else if (sortBy === 'disponibilite') {
        query += ` ORDER BY est_disponible DESC`; // True (1) avant False (0)
    } else {
        query += ` ORDER BY l.titre ASC`; // Tri par défaut
    }

    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (err) {
        throw new Error("Erreur SQL : " + err.message);
    }
};

module.exports = {
    getAllBooks
};