const express = require('express');
const router = express.Router();
const ollama = require('ollama').default; // Use .default for CommonJS if needed
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/chat', async (req, res, next) => {
    try {
        const { message } = req.body;

        // 1. Get embedding for user query
        const embeddingRes = await ollama.embeddings({
        model: 'llama3.2',
        prompt: message,
        });

        // 2. Search Supabase for context
        const { data: matchedBooks, error } = await supabase.rpc('match_books', {
        query_embedding: embeddingRes.embedding,
        match_threshold: 0.4,
        match_count: 3,
        });

        if (error) throw error;

        // 3. Prepare Context
        const context = matchedBooks?.map(b => 
        `- ${b.titre} par ${b.auteur}. Disponible: ${b.disponibilite ? 'Oui' : 'Non'}. Résumé: ${b.resume}`
        ).join('\n');

        // 4. Chat with Ollama
        const response = await ollama.chat({
        model: 'llama3.2',
        messages: [
            { role: 'system', content: 'Tu es un bibliothécaire serviable. Réponds en utilisant uniquement les livres fournis.' },
            { role: 'user', content: `Contexte:\n${context}\n\nQuestion: ${message}` }
        ],
        });

        res.json({ reply: response.message.content });
    } catch (err) {
        next(err); // This passes the error to your error handler in app.js
    }
});

module.exports = router;