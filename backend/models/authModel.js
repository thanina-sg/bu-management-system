const supabase = require('../db');

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

const loginUser = async (email) => {
    const { data, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) throw new Error("Utilisateur non trouvé");

    return data;
};

module.exports = {
    registerUser,
    loginUser
};
