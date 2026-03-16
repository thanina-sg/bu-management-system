const supabase = require('../db');

/**
 * Enregistre un nouvel emprunt ou crée une réservation si aucun exemplaire n'est disponible
 */
const creerEmprunt = async (id_utilisateur, isbn) => {
  // 1. Tenter de trouver UN exemplaire disponible
  const { data: exemplaire, error: exError } = await supabase
    .from('exemplaire')
    .select('id_exemplaire')
    .eq('isbn', isbn)
    .eq('disponibilite', true)
    .limit(1)
    .maybeSingle(); // Retourne null sans erreur si aucun exemplaire n'est trouvé

  // --- CAS A : UN EXEMPLAIRE EST DISPONIBLE -> ON FAIT L'EMPRUNT ---
  if (exemplaire) {
    const id_exemplaire = exemplaire.id_exemplaire;

    // Calcul de la date de retour (J + 14 jours)
    const dateRetourPrevue = new Date();
    dateRetourPrevue.setDate(dateRetourPrevue.getDate() + 14);

    // Créer l'emprunt
    const { data: emprunt, error: emError } = await supabase
      .from('emprunt')
      .insert([{
        id_utilisateur: id_utilisateur,
        id_exemplaire: id_exemplaire,
        date_retour_prevue: dateRetourPrevue.toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (emError) throw emError;

    // Mettre à jour la disponibilité de l'exemplaire à 'false'
    const { error: upError } = await supabase
      .from('exemplaire')
      .update({ disponibilite: false })
      .eq('id_exemplaire', id_exemplaire);

    if (upError) throw upError;

    return { type: 'EMPRUNT', data: emprunt };
  } 

  // --- CAS B : AUCUN EXEMPLAIRE DISPONIBLE -> ON CRÉE UNE RÉSERVATION ---
  else {
    // Calculer la position dans la file (nombre de résas EN_ATTENTE pour cet ISBN + 1)
    const { count, error: countError } = await supabase
      .from('reservation')
      .select('*', { count: 'exact', head: true })
      .eq('isbn', isbn)
      .eq('statut', 'EN_ATTENTE');

    if (countError) throw countError;

    const nouvellePosition = (count || 0) + 1;

    // Créer la réservation
    const { data: reservation, error: resError } = await supabase
      .from('reservation')
      .insert([{
        id_utilisateur,
        isbn,
        position_file: nouvellePosition,
        statut: 'EN_ATTENTE'
      }])
      .select()
      .single();

    if (resError) throw resError;

    return { type: 'RESERVATION', data: reservation };
  }
};

/**
 * Récupérer les emprunts en cours d'un utilisateur
 */
const getEmpruntsByUserId = async (id_utilisateur) => {
  const { data, error } = await supabase
    .from('emprunt')
    .select(`
      *,
      exemplaire (
        livre (titre, auteur)
      )
    `)
    .eq('id_utilisateur', id_utilisateur)
    .is('date_retour_reelle', null);

  if (error) throw error;
  return data;
};

module.exports = {
  creerEmprunt,
  getEmpruntsByUserId
};