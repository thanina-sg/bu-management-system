require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
    console.log("Connecting to:", process.env.SUPABASE_URL);
    
    // Try to fetch users (even if empty, it shouldn't error)
    const { data, error } = await supabase.from('utilisateur').select('*').limit(1);

    if (error) {
        console.error("Connection failed:", error.message);
    } else {
        console.log("Connection successful! Database is responding.");
    }
}

testConnection();