const supabase = require('../db');

/**
 * GET /api/reservations
 * Liste les réservations avec jointures Utilisateur et Livre
 */
const listReservations = async (studentId = null, status = null) => {
  let query = supabase
    .from('reservation')
    .select(`
      id,
      id_utilisateur,
      isbn,
      date_reservation,
      statut,
      position_file,
      utilisateur:id_utilisateur (id, nom, prenom, email, role, statut),
      livre:isbn (isbn, titre, auteur, categorie, annee, resume)
    `)
    .order('date_reservation', { ascending: false });

  // Application des filtres (studentId correspond à id_utilisateur)
  if (studentId) query = query.eq('id_utilisateur', studentId);
  if (status) query = query.eq('statut', status);

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data ?? [];
};

/**
 * POST /api/reservations
 * Insère une nouvelle réservation et calcule la position dans la file
 */
const insertReservation = async (studentId, isbn) => {
  // 1. Calculer la position (nb de résas actives pour cet ISBN + 1)
  const { count } = await supabase
    .from('reservation')
    .select('*', { count: 'exact', head: true })
    .eq('isbn', isbn)
    .eq('statut', 'EN_ATTENTE'); // On reste sur le terme SQL

  const position = (count || 0) + 1;

  // 2. Insertion
  const { data, error } = await supabase
    .from('reservation')
    .insert([{
      id_utilisateur: studentId,
      isbn: isbn,
      position_file: position,
      statut: 'EN_ATTENTE' // Aligné sur DEFAULT SQL
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * PUT /api/reservations/:id
 */
const updateStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('reservation')
    .update({ statut: status })
    .eq('id', id) // 'id' au lieu de 'id_reservation'
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * DELETE /api/reservations/:id
 */
const deleteReservation = async (id) => {
  const { error } = await supabase
    .from('reservation')
    .delete()
    .eq('id', id); // 'id' au lieu de 'id_reservation'

  if (error) throw error;
  return true;
};

module.exports = {
  listReservations,
  insertReservation,
  updateStatus,
  deleteReservation
};