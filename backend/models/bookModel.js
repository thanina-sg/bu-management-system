const supabase = require('../db');

const getAllBooks = async (filters = {}) => {
  const { search, categorie, sortBy } = filters;

  // On sélectionne le livre + le premier exemplaire (disponibilité)
  let query = supabase
    .from('livre')
    .select(`
      *,
      exemplaire!inner(disponibilite)
    `);

  // Recherche par titre, auteur ou ISBN
  if (search) {
    query = query.or(`titre.ilike.%${search}%,auteur.ilike.%${search}%,isbn.ilike.%${search}%`);
  }

  // Filtre par catégorie
  if (categorie) {
    query = query.eq('categorie', categorie);
  }

  // Tri
  if (sortBy === 'auteur') {
    query = query.order('auteur', { ascending: true });
  } else if (sortBy === 'disponibilite') {
    query = query.order('disponibilite', { foreignTable: 'exemplaire', ascending: false });
  } else {
    query = query.order('titre', { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Erreur Supabase : " + error.message);
  }

  // Comme on n’a qu’un exemplaire par livre, on mappe directement la disponibilité
  const books = data.map(b => ({
    isbn: b.isbn,
    titre: b.titre,
    auteur: b.auteur,
    categorie: b.categorie,
    annee: b.annee,
    est_disponible: b.exemplaire[0]?.disponibilite ?? false
  }));

  return books;
};

module.exports = {
  getAllBooks
};