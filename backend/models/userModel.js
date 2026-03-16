const supabase = require('../db');

const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('id, nom, prenom, email, role, statut, created_at')
    .order('nom', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
};

module.exports = {
  getAllUsers,
};
