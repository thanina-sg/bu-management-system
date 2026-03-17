const supabase = require('../db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// --- REGISTER ---
const registerUser = async (email, nom, prenom, role) => {
    const { data, error: dbError } = await supabase
        .from('utilisateur')
        .insert([{ 
            email, 
            nom, 
            prenom, 
            role: role || 'ETUDIANT'
        }])
        .select(); 

    if (dbError) throw dbError;

    return data[0];
};

// --- LOGIN STUDENT/TEACHER ---
const loginStudent = async (email, password) => {
    const { data: user, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', email)
        .in('role', ['ETUDIANT', 'ENSEIGNANT'])
        .single();

    if (error || !user) throw new Error("Utilisateur non trouvé");

    // For now, if user exists, grant access (in production, verify password hash)
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { user, token };
};

// --- LOGIN STAFF (LIBRARIAN/ADMIN) ---
const loginStaff = async (email, password) => {
    const { data: user, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', email)
        .in('role', ['BIBLIOTHECAIRE', 'ADMIN'])
        .single();

    if (error || !user) throw new Error("Accès refusé - utilisateur non autorisé");

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    return { user, token, role: user.role };
};

// --- LOGOUT ---
const logout = async (token) => {
    // Token invalidation would be handled on frontend (remove token from localStorage)
    return { message: "Logout successful" };
};

// --- GET CURRENT USER ---
const getCurrentUser = async (userId) => {
    const { data: user, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !user) throw new Error("Utilisateur non trouvé");

    return user;
};

module.exports = {
    registerUser,
    loginStudent,
    loginStaff,
    logout,
    getCurrentUser
};
