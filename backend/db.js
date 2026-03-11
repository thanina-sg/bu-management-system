require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error(" ERREUR : SUPABASE_URL ou SUPABASE_KEY manquante dans le fichier .env");
    process.exit(1); 
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Client Supabase initialisé");

module.exports = supabase;