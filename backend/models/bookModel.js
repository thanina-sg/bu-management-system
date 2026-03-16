const supabase = require('../db');

// --- GET 1 : Pour filtrer et lister (Catalogue) ---
const getAllBooks = async (filters = {}) => {
  const { search, categorie, sortBy } = filters;
  // On sélectionne tout (*) + les exemplaires pour le calcul
  let query = supabase.from('livre').select(`*, exemplaire(disponibilite)`);

  if (search) query = query.or(`titre.ilike.%${search}%,auteur.ilike.%${search}%,isbn.ilike.%${search}%`);
  if (categorie) query = query.eq('categorie', categorie);

  const { data, error } = await query;
  if (error) throw error;

  return data.map(b => ({
    isbn: b.isbn,
    titre: b.titre,
    auteur: b.auteur,
    categorie: b.categorie,
    // --- AJOUTS ICI ---
    annee: b.annee,     // Ajout de l'année
    resume: b.resume,   // Ajout du résumé
    // ------------------
    nb_disponible: b.exemplaire ? b.exemplaire.filter(ex => ex.disponibilite).length : 0,
    est_disponible: b.exemplaire ? b.exemplaire.some(ex => ex.disponibilite) : false
  }));
};

// --- GET 2 : Pour récupérer la dispo d'un livre précis ---
const getDisponibiliteByIsbn = async (isbn) => {
  // On récupère aussi les infos du livre pour ne pas avoir d'objet vide dans le front
  const { data: livreInfo } = await supabase
    .from('livre')
    .select('annee, resume')
    .eq('isbn', isbn)
    .single();

  const { data, count, error } = await supabase
    .from('exemplaire')
    .select('*', { count: 'exact' })
    .eq('isbn', isbn)
    .eq('disponibilite', true);

  if (error) throw error;

  return {
    isbn,
    nb_disponible: count || 0,
    disponible: (count || 0) > 0,
    exemplaires_ids: data.map(ex => ex.id_exemplaire),
    // On renvoie aussi les infos ici au cas où
    annee: livreInfo?.annee,
    resume: livreInfo?.resume
  };
};

module.exports = { getAllBooks, getDisponibiliteByIsbn };