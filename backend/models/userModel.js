const supabase = require('../db');

/**
 * Récupère tous les utilisateurs avec calcul du statut dynamique
 */
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select(`
      id, 
      nom, 
      prenom, 
      email, 
      role, 
      statut, 
      created_at,
      emprunt(id) 
    `)
    .is('emprunt.date_retour_reelle', null) // On ne récupère que les emprunts non rendus
    .order('nom', { ascending: true });

  if (error) throw new Error(error.message);

  // On transforme la donnée pour le Frontend/Swagger
  return data.map(user => {
    const aDesEmpruntsEnCours = user.emprunt && user.emprunt.length > 0;
    
    return {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      // Si l'utilisateur est ACTIF mais qu'il a un livre, on affiche EMPRUNTEUR
      statut: (user.statut === 'ACTIF' && aDesEmpruntsEnCours) ? 'EMPRUNTEUR' : user.statut,
      created_at: user.created_at
    };
  });
};

/**
 * Récupère un utilisateur spécifique (pour la route /me)
 */
const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('id, nom, prenom, email, role, statut, created_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

module.exports = {
  getAllUsers,
  getUserById
};