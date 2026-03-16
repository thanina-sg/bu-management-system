const supabase = require('../db');

const getAllEmprunts = async () => {
  const { data, error } = await supabase
    .from('emprunt')
    .select(
      'id, id_utilisateur, id_exemplaire, date_emprunt, date_retour_prevue, date_retour_reelle, utilisateur (id, nom, prenom, email), exemplaire (id_exemplaire, isbn, etat, localisation)',
    )
    .order('date_emprunt', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

module.exports = {
  getAllEmprunts,
};
