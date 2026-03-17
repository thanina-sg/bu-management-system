const express = require('express');
const router = express.Router();
const ollama = require('ollama').default;
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase (Ensure your .env variables are correct)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

router.post('/chat', async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Le message est requis." });
        }

        // 1. Get embedding for the user's question
        // We use llama3.2 to match your ingestion script (3072 dimensions)
        const embeddingRes = await ollama.embeddings({
            model: 'llama3.2',
            prompt: message,
        });

        // 2. Search Supabase for the most relevant books
        // This calls the postgres function we created earlier
        const { data: matchedBooks, error } = await supabase.rpc('match_books', {
            query_embedding: embeddingRes.embedding,
            match_threshold: 0.3, // Adjust this between 0.1 and 1.0 to tune precision
            match_count: 3,       // Number of books to suggest
        });

        if (error) {
            console.error("Erreur Recherche SQL:", error.message);
            throw error;
        }

        // 3. Build the context for the AI
        // We format the database results into a string the AI can read
        const context = matchedBooks?.length > 0 
            ? matchedBooks.map(b => 
                `- ${b.titre} par ${b.auteur}. Disponible: ${b.disponibilite ? 'Oui' : 'Non'}. Résumé: ${b.resume}`
              ).join('\n')
            : "Aucun livre trouvé dans le catalogue pour cette recherche.";

        // 4. Generate the final response with Ollama
        const response = await ollama.chat({
            model: 'llama3.2',
            messages: [
                { 
                    role: 'system', 
                    content: `Tu es l'assistant IA de la bibliothèque universitaire. 
                    Réponds poliment en français. 
                    Aide les étudiants à trouver des livres en te basant UNIQUEMENT sur le contexte fourni ci-dessous. 
                    Si le contexte ne contient pas la réponse, dis-le simplement.` 
                },
                { 
                    role: 'user', 
                    content: `Voici les livres pertinents trouvés dans la base de données:\n${context}\n\nQuestion de l'étudiant: ${message}` 
                }
            ],
        });

        // 5. Send the response back to the frontend/Swagger
        res.json({ reply: response.message.content });

    } catch (err) {
        console.error("AI Route Error:", err);
        next(err);
    }
});

module.exports = router;