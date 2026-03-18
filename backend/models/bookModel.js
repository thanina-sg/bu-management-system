const supabase = require('../db');

// --- GET BOOKS (with filtering) ---
const getBooks = async (filters = {}) => {
  const { search, category, status } = filters;
  
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

    return {
      id: book.isbn,
      title: book.titre,
      author: book.auteur,
      category: book.categorie,
      year: book.annee,
      description: book.resume,
      isbn: book.isbn,
      status: (count || 0) > 0 ? 'Available' : 'Borrowed',
      coverUrl: null
    };
  }));

  return booksWithStatus;
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

  return {
    id: book.isbn,
    title: book.titre,
    author: book.auteur,
    category: book.categorie,
    year: book.annee,
    description: book.resume,
    isbn: book.isbn,
    status: (count || 0) > 0 ? 'Available' : 'Borrowed',
    coverUrl: null
  };
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

      return {
        id: item.isbn_cible,
        title: book?.titre,
        author: book?.auteur,
        category: book?.categorie,
        year: book?.annee,
        description: book?.resume,
        isbn: item.isbn_cible,
        status: (count || 0) > 0 ? 'Available' : 'Borrowed'
      };
    })
  );

  return recommendations;
};

// --- ADD BOOK ---
const addBook = async (bookData) => {
  const { title, author, isbn, year, category, location, description } = bookData;

  const { data, error } = await supabase
    .from('livre')
    .insert([{
      isbn,
      titre: title,
      auteur: author,
      annee: year,
      categorie: category,
      resume: description
    }])
    .select();

  if (error) throw error;

  // Create exemplaire (copy)
  const { data: exemplaire, error: exError } = await supabase
    .from('exemplaire')
    .insert([{
      isbn,
      localisation: location,
      disponibilite: true
    }])
    .select();

  if (exError) throw exError;

  return data[0];
};

// --- UPDATE BOOK ---
const updateBook = async (isbn, updates) => {
  const { status, location, category } = updates;

  let updateData = {};
  if (category) updateData.categorie = category;

  if (Object.keys(updateData).length > 0) {
    const { error } = await supabase
      .from('livre')
      .update(updateData)
      .eq('isbn', isbn);

    if (error) throw error;
  }

  if (location || status) {
    const exemplareUpdate = {};
    if (location) exemplareUpdate.localisation = location;
    if (status === 'Borrowed') exemplareUpdate.disponibilite = false;
    if (status === 'Available') exemplareUpdate.disponibilite = true;

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