import ollama from 'ollama';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_KEY || ''
);

async function main() {
    // 1. Fetch books that have a resume but no embedding
    const { data: books, error } = await supabase
        .from('livre')
        .select('isbn, titre, resume')
        .is('embedding', null)
        .not('resume', 'is', null);

    if (error) throw error;
    if (!books || books.length === 0) {
        console.log("No new books to process.");
        return;
    }

    console.log(`Processing ${books.length} books...`);

    for (const book of books) {
        // 2. Generate vector using Ollama
        // We use llama3.2 because it supports the 3072 dimensions we set in SQL
        const response = await ollama.embeddings({
        model: 'llama3.2',
        prompt: `${book.titre}: ${book.resume}`
        });

        const vector = response.embedding;

        // 3. Save the vector back to the DB
        const { error: updateError } = await supabase
        .from('livre')
        .update({ embedding: vector })
        .eq('isbn', book.isbn);

        if (updateError) {
        console.error(`Error updating ${book.titre}:`, updateError);
        } else {
        console.log(`Indexed: ${book.titre}`);
        }
    }
}

main();