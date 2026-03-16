const supabase = require('../db');

const getAllReservations = async () => {
  const { data, error } = await supabase
    .from('reservation')
    .select(
      'id, id_utilisateur, isbn, date_reservation, statut, position_file, utilisateur (id, nom, prenom, email), livre (isbn, titre, auteur, categorie)',
    )
    .order('date_reservation', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
};

module.exports = {
  getAllReservations,
};
