const supabase = require('../db');

const toBookDto = (book, availableCount = 0) => ({
  id: book.isbn,
  isbn: book.isbn,
  titre: book.titre,
  auteur: book.auteur,
  categorie: book.categorie,
  annee: book.annee,
  resume: book.resume,
  disponible: (availableCount || 0) > 0,
  localisation: book.localisation || null,
  couverture_url: null,
});

// --- GET BOOKS (with filtering) ---
const getBooks = async (filters = {}) => {
  const { search, category, disponible } = filters;
  
  let query = supabase.from('livre').select(`
    isbn,
    titre,
    auteur,
    categorie,
    annee,
    resume
  `);

  if (search) {
    query = query.or(`titre.ilike.%${search}%,auteur.ilike.%${search}%,isbn.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq('categorie', category);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Enrich with availability info
  const booksWithStatus = await Promise.all(data.map(async (book) => {
    const { count } = await supabase
      .from('exemplaire')
      .select('*', { count: 'exact' })
      .eq('isbn', book.isbn)
      .eq('disponibilite', true);

    return toBookDto(book, count);
  }));

  if (disponible === undefined) {
    return booksWithStatus;
  }

  const wanted = String(disponible) === 'true';
  return booksWithStatus.filter((book) => book.disponible === wanted);
};

// --- GET SINGLE BOOK ---
const getBookById = async (isbn) => {
  const { data: book, error } = await supabase
    .from('livre')
    .select('*')
    .eq('isbn', isbn)
    .single();

  if (error || !book) throw new Error("Livre non trouvé");

  const { count } = await supabase
    .from('exemplaire')
    .select('*', { count: 'exact' })
    .eq('isbn', isbn)
    .eq('disponibilite', true);

  return toBookDto(book, count);
};

// --- GET BOOK RECOMMENDATIONS ---
const getRecommendations = async (isbn) => {
  const { data: similar, error } = await supabase
    .from('livre_similitude')
    .select('isbn_cible, score_similitude')
    .eq('isbn_source', isbn)
    .order('score_similitude', { ascending: false })
    .limit(5);

  if (error) throw error;

  const recommendations = await Promise.all(
    similar.map(async (item) => {
      const { data: book } = await supabase
        .from('livre')
        .select('*')
        .eq('isbn', item.isbn_cible)
        .single();

      const { count } = await supabase
        .from('exemplaire')
        .select('*', { count: 'exact' })
        .eq('isbn', item.isbn_cible)
        .eq('disponibilite', true);

      return toBookDto({
        isbn: item.isbn_cible,
        titre: book?.titre,
        auteur: book?.auteur,
        categorie: book?.categorie,
        annee: book?.annee,
        resume: book?.resume,
      }, count);
    })
  );

  return recommendations;
};

// --- ADD BOOK ---
const addBook = async (bookData) => {
  const {
    titre,
    auteur,
    isbn,
    annee,
    categorie,
    localisation,
    resume,
  } = bookData;

  const { data, error } = await supabase
    .from('livre')
    .insert([{
      isbn,
      titre,
      auteur,
      annee,
      categorie,
      resume,
    }])
    .select();

  if (error) throw error;

  // Create exemplaire (copy)
  const { data: exemplaire, error: exError } = await supabase
    .from('exemplaire')
    .insert([{
      isbn,
      localisation,
      disponibilite: true
    }])
    .select();

  if (exError) throw exError;

  return toBookDto(data[0], 1);
};

// --- UPDATE BOOK ---
const updateBook = async (isbn, updates) => {
  const { disponible, localisation, categorie } = updates;

  let updateData = {};
  if (categorie !== undefined) updateData.categorie = categorie;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('livre')
      .update(updateData)
      .eq('isbn', isbn);

    if (error) throw error;
  }

  if (localisation !== undefined || disponible !== undefined) {
    const exemplareUpdate = {};
    if (localisation !== undefined) exemplareUpdate.localisation = localisation;
    if (disponible !== undefined) exemplareUpdate.disponibilite = !!disponible;

    const { error } = await supabase
      .from('exemplaire')
      .update(exemplareUpdate)
      .eq('isbn', isbn);

    if (error) throw error;
  }

  return getBookById(isbn);
};

// --- DELETE BOOK ---
const deleteBook = async (isbn) => {
  const { error } = await supabase
    .from('livre')
    .delete()
    .eq('isbn', isbn);

  if (error) throw error;

  return { message: "Livre supprimé" };
};

module.exports = {
  getBooks,
  getBookById,
  getRecommendations,
  addBook,
  updateBook,
  deleteBook
};
