const supabase = require('../db');

/**
 * --- GET : Liste tous les livres (Catalogue) ---
 * Gère la recherche globale, le filtrage par catégorie et le tri.
 */
const getAllBooks = async (filters = {}) => {
  const { search, categorie, sortBy } = filters;
  
  let query = supabase.from('livre').select(`
    isbn, 
    titre, 
    auteur, 
    categorie, 
    annee,
    resume,
    exemplaire(id_exemplaire, disponibilite, etat, localisation)
  `);

  if (search) {
    query = query.or(`titre.ilike.%${search}%,auteur.ilike.%${search}%,isbn.ilike.%${search}%`);
  }

  if (categorie) {
    query = query.eq('categorie', categorie);
  }

  if (sortBy) {
    const validSortFields = ['titre', 'auteur', 'annee'];
    if (validSortFields.includes(sortBy)) {
      query = query.order(sortBy, { ascending: true });
    }
  }

  const { data, error } = await query;
  if (error) throw error;

  return data.map(b => ({
    isbn: b.isbn,
    titre: b.titre,
    auteur: b.auteur,
    categorie: b.categorie,
    annee: b.annee,
    resume: b.resume, 
    est_disponible: b.exemplaire ? b.exemplaire.some(ex => ex.disponibilite === true) : false,
    exemplaire: b.exemplaire && b.exemplaire.length > 0 ? b.exemplaire[0] : null
  }));
};

/**
 * --- GET : Détails d'un livre spécifique ---
 * Utilisé par getBookById dans le controller
 */
const getBookByIsbn = async (isbn) => {
  const { data, error } = await supabase
    .from('livre')
    .select(`
      isbn, 
      titre, 
      auteur, 
      categorie, 
      annee,
      resume,
      exemplaire(id_exemplaire, disponibilite, etat, localisation)
    `)
    .eq('isbn', isbn)
    .single();

  // Si le livre n'est pas trouvé (code PGRST116), on retourne null proprement
  if (error && error.code === 'PGRST116') return null;
  if (error) throw error;

  return {
    ...data,
    est_disponible: data.exemplaire ? data.exemplaire.some(ex => ex.disponibilite === true) : false,
    exemplaire: data.exemplaire && data.exemplaire.length > 0 ? data.exemplaire[0] : null
  };
};

/**
 * --- GET : Stock réel pour un ISBN ---
 */
const getDisponibiliteByIsbn = async (isbn) => {
  const { count, error } = await supabase
    .from('exemplaire')
    .select('id_exemplaire', { count: 'exact', head: true })
    .eq('isbn', isbn)
    .eq('disponibilite', true);

  if (error) throw error;

  return {
    isbn: isbn,
    nb_disponible: count || 0,
    disponible: (count || 0) > 0
  };
};

/**
 * --- POST : Ajouter un livre ---
 */
const createBook = async (bookData) => {
  const { data, error } = await supabase
    .from('livre')
    .insert([
      {
        isbn: bookData.isbn,
        titre: bookData.titre,
        auteur: bookData.auteur,
        categorie: bookData.categorie,
        annee: bookData.annee,
        resume: bookData.resume // Harmonisé SQL Snake Case
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * --- PUT : Mise à jour ---
 */
const updateBook = async (isbn, updatedData) => {
  const { data, error } = await supabase
    .from('livre')
    .update({
      titre: updatedData.titre,
      auteur: updatedData.auteur,
      categorie: updatedData.categorie,
      annee: updatedData.annee,
      resume: updatedData.resume // Harmonisé SQL Snake Case
    })
    .eq('isbn', isbn)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * --- DELETE : Suppression ---
 */
const deleteBook = async (isbn) => {
  const { error } = await supabase
    .from('livre')
    .delete()
    .eq('isbn', isbn);

  if (error) throw error;
  return true;
};

module.exports = { 
  getAllBooks, 
  getBookByIsbn, // Ajouté pour le controller
  getDisponibiliteByIsbn, 
  createBook, 
  updateBook, 
  deleteBook 
};