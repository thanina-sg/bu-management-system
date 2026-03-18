const supabase = require('../db');
const crypto = require('crypto');

// Simple password hashing function (not for production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// --- GET ALL USERS (Admin only) ---
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(user => ({
    id: user.id,
    name: `${user.prenom} ${user.nom}`,
    email: user.email,
    role: user.role === 'ETUDIANT' ? 'Student' : 
          user.role === 'ENSEIGNANT' ? 'Teacher' :
          user.role === 'BIBLIOTHECAIRE' ? 'Librarian' : 'Admin'
  }));
};

// --- GET CURRENT USER ---
const getCurrentUser = async (userId) => {
  const { data: user, error } = await supabase
    .from('utilisateur')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) throw new Error("Utilisateur non trouvé");

  return {
    id: user.id,
    name: `${user.prenom} ${user.nom}`,
    email: user.email,
    role: user.role === 'ETUDIANT' ? 'Student' : 
          user.role === 'ENSEIGNANT' ? 'Teacher' :
          user.role === 'BIBLIOTHECAIRE' ? 'Librarian' : 'Admin'
  };
};

// --- CREATE USER (Admin only) ---
const createUser = async (userData) => {
  const { name, email, role, password } = userData;
  const [prenom, ...nomParts] = name.split(' ');
  const nom = nomParts.join(' ') || 'User';

  const roleMap = {
    'Student': 'ETUDIANT',
    'Teacher': 'ENSEIGNANT',
    'Librarian': 'BIBLIOTHECAIRE',
    'Admin': 'ADMINISTRATEUR'
  };

  // Password is required
  if (!password) {
    throw new Error('Password is required when creating a user');
  }
  const passwordHash = hashPassword(password);

  const mappedRole = roleMap[role] || 'ETUDIANT';

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

  return {
    id: user[0].id,
    name,
    email: user[0].email,
    role: user[0].role
  };
};

// --- UPDATE USER (Admin only) ---
const updateUser = async (userId, updates) => {
  const { name, email, role } = updates;

  let updateData = {};
  if (name) {
    const [prenom, ...nomParts] = name.split(' ');
    updateData.prenom = prenom;
    updateData.nom = nomParts.join(' ') || 'User';
  }
  if (email) updateData.email = email;
  if (role) {
    const roleMap = {
      'Student': 'ETUDIANT',
      'Teacher': 'ENSEIGNANT',
      'Librarian': 'BIBLIOTHECAIRE',
      'Admin': 'ADMINISTRATEUR'
    };
    updateData.role = roleMap[role] || 'ETUDIANT';
  }

  const { data: updated, error } = await supabase
    .from('utilisateur')
    .update(updateData)
    .eq('id', userId)
    .select();

  if (error) throw error;

  return {
    id: updated[0].id,
    name: `${updated[0].prenom} ${updated[0].nom}`,
    email: updated[0].email,
    role: updated[0].role === 'ETUDIANT' ? 'Student' : 
          updated[0].role === 'ENSEIGNANT' ? 'Teacher' :
          updated[0].role === 'BIBLIOTHECAIRE' ? 'Librarian' : 'Admin'
  };
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
