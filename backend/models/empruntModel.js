const supabase = require('../db');

/**
 * Enregistre un nouvel emprunt ou crée une réservation si aucun exemplaire n'est disponible
 */
const creerEmprunt = async (id_utilisateur, isbn) => {
  // 1. Tenter de trouver UN exemplaire disponible
  const { data: exemplaire } = await supabase
    .from('exemplaire')
    .select('id_exemplaire')
    .eq('isbn', isbn)
    .eq('disponibilite', true)
    .limit(1)
    .maybeSingle();

  // --- CAS A : UN EXEMPLAIRE EST DISPONIBLE -> ON FAIT L'EMPRUNT ---
  if (exemplaire) {
    const id_exemplaire = exemplaire.id_exemplaire;
    const datePrevue = new Date();
    datePrevue.setDate(datePrevue.getDate() + 14);

    const { data: emprunt, error: emError } = await supabase
      .from('emprunt')
      .insert([{
        id_utilisateur: id_utilisateur,
        id_exemplaire: id_exemplaire,
        date_retour_prevue: datePrevue.toISOString().split('T')[0]
      }])
      .select(`
        id,
        date_emprunt,
        date_retour_prevue,
        id_utilisateur,
        id_exemplaire
      `)
      .single();

    if (emError) throw emError;

    // Mettre à jour la disponibilité de l'exemplaire
    await supabase
      .from('exemplaire')
      .update({ disponibilite: false })
      .eq('id_exemplaire', id_exemplaire);

    return { 
      type: 'EMPRUNT', 
      data: { 
        ...emprunt, 
        date_retour_reelle: null 
      } 
    };
  } 

  // --- CAS B : AUCUN EXEMPLAIRE DISPONIBLE -> ON CRÉE UNE RÉSERVATION ---
  else {
    // On compte combien de personnes attendent DEJA ce livre précis
    const { count } = await supabase
      .from('reservation')
      .select('*', { count: 'exact', head: true })
      .eq('isbn', isbn)
      .eq('statut', 'EN_ATTENTE');

    const { data: reservation, error: resError } = await supabase
      .from('reservation')
      .insert([{
        id_utilisateur,
        isbn,
        position_file: (count || 0) + 1,
        statut: 'EN_ATTENTE'
      }])
      .select()
      .single();

    if (resError) throw resError;
    return { type: 'RESERVATION', data: reservation };
  }
};

/**
 * Récupérer les emprunts d'un utilisateur
 */
const getEmpruntsByUserId = async (id_utilisateur) => {
  const { data, error } = await supabase
    .from('emprunt')
    .select(`
      id,
      date_emprunt,
      date_retour_prevue,
      date_retour_reelle,
      id_utilisateur,
      id_exemplaire,
      exemplaire (
        id_exemplaire,
        isbn,
        livre (titre, auteur)
      )
    `)
    .eq('id_utilisateur', id_utilisateur);

  if (error) throw error;
  return data;
};

/**
 * Enregistre le retour d'un livre (Action PUT /return)
 */
const enregistrerRetour = async (idEmprunt, date_retour_reelle) => {
  // 1. On récupère l'id_exemplaire lié à cet emprunt (clé primaire 'id')
  const { data: loan } = await supabase
    .from('emprunt')
    .select('id_exemplaire')
    .eq('id', idEmprunt)
    .single();

  if (!loan) throw new Error("Emprunt introuvable");

  // 2. Update de l'emprunt
  const { data, error } = await supabase
    .from('emprunt')
    .update({ 
      date_retour_reelle: date_retour_reelle || new Date().toISOString().split('T')[0] 
    })
    .eq('id', idEmprunt)
    .select()
    .single();

  if (error) throw error;

  // 3. Remettre l'exemplaire en disponible
  await supabase
    .from('exemplaire')
    .update({ disponibilite: true })
    .eq('id_exemplaire', loan.id_exemplaire);

  return data;
};

module.exports = {
  creerEmprunt,
  getEmpruntsByUserId,
  enregistrerRetour
};