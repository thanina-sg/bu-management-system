const supabase = require('../db');
const crypto = require('crypto');

// Simple password hashing function (not for production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

const toFrenchRole = (role) => {
  const roleMap = {
    ETUDIANT: 'ETUDIANT',
    ENSEIGNANT: 'ENSEIGNANT',
    BIBLIOTHECAIRE: 'BIBLIOTHECAIRE',
    ADMIN: 'ADMINISTRATEUR',
    ADMINISTRATEUR: 'ADMINISTRATEUR',
    Student: 'ETUDIANT',
    Teacher: 'ENSEIGNANT',
    Librarian: 'BIBLIOTHECAIRE',
    Admin: 'ADMINISTRATEUR',
  };
  return roleMap[role] || 'ETUDIANT';
};

const toUserDto = (user) => ({
  id: user.id,
  nom: user.nom,
  prenom: user.prenom,
  email: user.email,
  role: user.role,
  statut: user.statut,
});

// --- GET ALL USERS (Admin only) ---
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(toUserDto);
};

// --- GET CURRENT USER ---
const getCurrentUser = async (userId) => {
  const { data: user, error } = await supabase
    .from('utilisateur')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) throw new Error("Utilisateur non trouvé");

  return toUserDto(user);
};

// --- CREATE USER (Admin only) ---
const createUser = async (userData) => {
  const { nom, prenom, email, role, password } = userData;

  const defaultPassword = `${prenom.toLowerCase()}.${nom.toLowerCase().replace(/\s+/g, '')}123`;
  const effectivePassword = password || defaultPassword;
  const passwordHash = hashPassword(effectivePassword);

  const mappedRole = toFrenchRole(role);

  const { data: user, error } = await supabase
    .from('utilisateur')
    .insert([{
      nom,
      prenom,
      email,
      role: mappedRole,
      password_hash: passwordHash,
      statut: 'ACTIF'
    }])
    .select();

  if (error) throw error;

  return toUserDto(user[0]);
};

// --- UPDATE USER (Admin only) ---
const updateUser = async (userId, updates) => {
  const { nom, prenom, email, role } = updates;

  let updateData = {};
  if (nom !== undefined) updateData.nom = nom;
  if (prenom !== undefined) updateData.prenom = prenom;
  if (email) updateData.email = email;
  if (role) {
    updateData.role = toFrenchRole(role);
  }

  const { data: updated, error } = await supabase
    .from('utilisateur')
    .update(updateData)
    .eq('id', userId)
    .select();

  if (error) throw error;

  return toUserDto(updated[0]);
};

// --- DELETE USER (Admin only) ---
const deleteUser = async (userId) => {
  const { error } = await supabase
    .from('utilisateur')
    .delete()
    .eq('id', userId);

  if (error) throw error;

  return { message: "Utilisateur supprimé" };
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  createUser,
  updateUser,
  deleteUser
};
