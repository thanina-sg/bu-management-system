require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
    console.log("Connecting to:", process.env.SUPABASE_URL);
    
    // Check exemplaires count
    const { data, error } = await supabase.from('exemplaire').select('*', { count: 'exact' });

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`✓ Found ${data?.length || 0} exemplaires in database`);
        
        // Show a sample
        if (data && data.length > 0) {
            console.log("\nSample exemplaires:");
            console.log(data.slice(0, 3));
        }
    }
}

testConnection();