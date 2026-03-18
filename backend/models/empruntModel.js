const supabase = require('../db');

// --- GET LOANS (list, optionally filtered by student) ---
const getLoans = async (filters = {}) => {
  const { studentId, status } = filters;
  const today = new Date().toISOString().split('T')[0];

  let query = supabase.from('emprunt').select(`
    id,
    id_utilisateur,
    id_exemplaire,
    date_emprunt,
    date_retour_prevue,
    date_retour_reelle
  `);

  if (studentId) query = query.eq('id_utilisateur', studentId);

  const { data, error } = await query;
  if (error) throw error;

  // Enrich with book and user info, and calculate status
  const loans = await Promise.all(data.map(async (loan) => {
    // Determine status based on return dates
    let loanStatus;
    if (loan.date_retour_reelle) {
      loanStatus = 'RETOURNE';
    } else if (loan.date_retour_prevue < today) {
      loanStatus = 'EN_RETARD';
    } else {
      loanStatus = 'ACTIF';
    }

    // Filter by status if requested
    if (status && loanStatus !== status) {
      return null;
    }

    const { data: book } = await supabase
      .from('exemplaire')
      .select('isbn')
      .eq('id_exemplaire', loan.id_exemplaire)
      .single();

    const { data: bookDetail } = await supabase
      .from('livre')
      .select('titre')
      .eq('isbn', book?.isbn)
      .single();

    return {
      id: loan.id,
      id_utilisateur: loan.id_utilisateur,
      isbn: book?.isbn,
      titre_livre: bookDetail?.titre,
      date_emprunt: loan.date_emprunt,
      date_retour_prevue: loan.date_retour_prevue,
      date_retour_reelle: loan.date_retour_reelle,
      statut: loanStatus,
    };
  }));

  return loans.filter(loan => loan !== null);
};

// --- POST LOAN (create new loan) ---
const createLoan = async (studentId, isbn, returnDate) => {
  // Get available exemplaire
  const { data: exemplaire, error: exError } = await supabase
    .from('exemplaire')
    .select('id_exemplaire')
    .eq('isbn', isbn)
    .eq('disponibilite', true)
    .limit(1)
    .maybeSingle();

  if (exError || !exemplaire) throw new Error("Aucun exemplaire disponible");

  // Create loan (no statut field - use dates only)
  const { data: loan, error: loanError } = await supabase
    .from('emprunt')
    .insert([{
      id_utilisateur: studentId,
      id_exemplaire: exemplaire.id_exemplaire,
      date_emprunt: new Date().toISOString().split('T')[0],
      date_retour_prevue: returnDate
    }])
    .select();

  if (loanError) throw loanError;

  // Update exemplaire availability
  await supabase
    .from('exemplaire')
    .update({ disponibilite: false })
    .eq('id_exemplaire', exemplaire.id_exemplaire);

  const { data: bookDetail } = await supabase
    .from('livre')
    .select('titre')
    .eq('isbn', isbn)
    .single();

  return {
    id: loan[0].id,
    id_utilisateur: loan[0].id_utilisateur,
    isbn,
    titre_livre: bookDetail?.titre,
    date_emprunt: loan[0].date_emprunt,
    date_retour_prevue: loan[0].date_retour_prevue,
    date_retour_reelle: null,
    statut: 'ACTIF',
  };
};

// --- PUT LOAN RETURN ---
const returnLoan = async (loanId, returnDate) => {
  const { data: loan, error: fetchError } = await supabase
    .from('emprunt')
    .select('id_exemplaire, id_utilisateur, date_retour_prevue')
    .eq('id', loanId)
    .single();

  if (fetchError) throw fetchError;

  // Update loan (only date_retour_reelle, no statut field)
  const { data: updated, error: updateError } = await supabase
    .from('emprunt')
    .update({
      date_retour_reelle: returnDate
    })
    .eq('id', loanId)
    .select();

  if (updateError) throw updateError;

  const dateRetourPrevue = updated[0]?.date_retour_prevue || loan.date_retour_prevue;

  // Mark exemplaire as available
  await supabase
    .from('exemplaire')
    .update({ disponibilite: true })
    .eq('id_exemplaire', loan.id_exemplaire);

  // Check for overdue and create penalty if needed
  const isOverdue = new Date(returnDate) > new Date(dateRetourPrevue);
  if (isOverdue) {
    const daysOverdue = Math.ceil(
      (new Date(returnDate) - new Date(dateRetourPrevue)) / (1000 * 60 * 60 * 24)
    );
    
    await supabase.from('penalite').insert([{
      id_utilisateur: loan.id_utilisateur,
      motif: `Retard de ${daysOverdue} jours`,
      points_montant: daysOverdue * 5,
      statut: 'A_PAYER'
    }]);
  }

  const { data: exemplaire } = await supabase
    .from('exemplaire')
    .select('isbn')
    .eq('id_exemplaire', loan.id_exemplaire)
    .single();

  const { data: livre } = await supabase
    .from('livre')
    .select('titre')
    .eq('isbn', exemplaire?.isbn)
    .single();

  return {
    id: updated[0].id,
    id_utilisateur: loan.id_utilisateur,
    isbn: exemplaire?.isbn,
    titre_livre: livre?.titre,
    date_emprunt: updated[0].date_emprunt,
    date_retour_prevue: dateRetourPrevue,
    date_retour_reelle: updated[0].date_retour_reelle,
    statut: isOverdue ? 'EN_RETARD' : 'RETOURNE',
  };
};

module.exports = {
  getLoans,
  createLoan,
  returnLoan
};
