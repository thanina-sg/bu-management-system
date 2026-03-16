const supabase = require('../db');

const getAllBooks = async () => {
    const { data, error } = await supabase
        .from('livre')
        .select('isbn, titre, auteur, categorie, resume, annee')
        .order('titre', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
};

module.exports = {
    getAllBooks
};
