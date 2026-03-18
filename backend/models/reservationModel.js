const supabase = require('../db');

// --- GET RESERVATIONS ---
const getReservations = async (filters = {}) => {
  const { studentId, status } = filters;

  let query = supabase.from('reservation').select(`
    id,
    id_utilisateur,
    isbn,
    date_reservation,
    statut,
    position_file
  `);

  if (studentId) query = query.eq('id_utilisateur', studentId);
  if (status) {
    const statusMap = {
      'Pending': 'EN_ATTENTE',
      'Ready': 'PRETE',
      'Cancelled': 'ANNULEE'
    };
    query = query.eq('statut', statusMap[status] || status);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Enrich with book info
  const reservations = await Promise.all(data.map(async (res) => {
    const { data: book } = await supabase
      .from('livre')
      .select('titre')
      .eq('isbn', res.isbn)
      .single();

    return {
      id: res.id,
      id_utilisateur: res.id_utilisateur,
      isbn: res.isbn,
      titre_livre: book?.titre,
      date_reservation: res.date_reservation,
      position_file: res.position_file,
      statut: res.statut,
    };
  }));

  return reservations;
};

// --- POST RESERVATION ---
const createReservation = async (studentId, isbn) => {
  // Get max queue position
  const { data: lastRes } = await supabase
    .from('reservation')
    .select('position_file')
    .eq('isbn', isbn)
    .order('position_file', { ascending: false })
    .limit(1)
    .single();

  const queuePosition = (lastRes?.position_file || 0) + 1;

  const { data: reservation, error } = await supabase
    .from('reservation')
    .insert([{
      id_utilisateur: studentId,
      isbn,
      date_reservation: new Date().toISOString(),
      statut: 'EN_ATTENTE',
      position_file: queuePosition
    }])
    .select();

  if (error) throw error;

  const { data: book } = await supabase
    .from('livre')
    .select('titre')
    .eq('isbn', isbn)
    .single();

  return {
    id: reservation[0].id,
    id_utilisateur: reservation[0].id_utilisateur,
    isbn,
    titre_livre: book?.titre,
    date_reservation: reservation[0].date_reservation,
    position_file: queuePosition,
    statut: 'EN_ATTENTE',
  };
};

// --- PUT RESERVATION (update status) ---
const updateReservation = async (reservationId, status) => {
  const statusMap = {
    'Pending': 'EN_ATTENTE',
    'Ready': 'PRETE',
    'Cancelled': 'ANNULEE'
  };

  const { data: updated, error } = await supabase
    .from('reservation')
    .update({ statut: statusMap[status] || status })
    .eq('id', reservationId)
    .select();

  if (error) throw error;

  const { data: book } = await supabase
    .from('livre')
    .select('titre')
    .eq('isbn', updated[0].isbn)
    .single();

  return {
    id: updated[0].id,
    id_utilisateur: updated[0].id_utilisateur,
    isbn: updated[0].isbn,
    titre_livre: book?.titre,
    date_reservation: updated[0].date_reservation,
    position_file: updated[0].position_file,
    statut: statusMap[status] || status,
  };
};

// --- DELETE RESERVATION ---
const deleteReservation = async (reservationId) => {
  const { error } = await supabase
    .from('reservation')
    .delete()
    .eq('id', reservationId);

  if (error) throw error;

  return { message: "Réservation annulée" };
};

module.exports = {
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation
};
