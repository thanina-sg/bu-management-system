const supabase = require('../db');
const ollama = require('ollama').default;
const { findMatchingFaq, getAllFaq } = require('../models/faqModel');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Normalize text for pattern matching
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Answer: Low stock books or recently returned books
 */
async function answerLowStock() {
  const { data: books, error } = await supabase
    .from('exemplaire')
    .select(`
      livre:isbn (titre, auteur),
      id_exemplaire,
      disponibilite
    `);

  if (error) throw error;

  // Group by ISBN and count
  const grouped = {};
  books.forEach(ex => {
    const isbn = ex.livre.isbn || 'unknown';
    if (!grouped[isbn]) {
      grouped[isbn] = {
        titre: ex.livre.titre,
        auteur: ex.livre.auteur,
        total: 0,
        disponibles: 0
      };
    }
    grouped[isbn].total++;
    if (ex.disponibilite) grouped[isbn].disponibles++;
  });

  // Filter books with 0 available
  const unavailable = Object.values(grouped).filter(b => b.disponibles === 0);

  if (unavailable.length === 0) {
    return "Aucun livre en rupture actuellement. Tous nos livres sont disponibles!";
  }

  const lines = ['Livres actuellement en rupture:'];
  unavailable.slice(0, 10).forEach((b) => {
    lines.push(`- "${b.titre}" par ${b.auteur} (${b.total} exemplaires au total)`);
  });
  return lines.join('\n');
}

/**
 * Answer: Stock/availability for a specific book
 */
async function answerAvailabilityForBook(question) {
  const q = normalize(question);
  
  // Get all books with their exemplaire counts
  const { data: exemplaires, error } = await supabase
    .from('exemplaire')
    .select(`
      isbn,
      disponibilite,
      livre:isbn (titre, auteur)
    `);

  if (error) throw error;

  // Group by ISBN
  const grouped = {};
  exemplaires.forEach(ex => {
    const isbn = ex.isbn || 'unknown';
    if (!grouped[isbn]) {
      grouped[isbn] = {
        isbn: isbn,
        titre: ex.livre?.titre || 'Unknown',
        auteur: ex.livre?.auteur || 'Unknown',
        total: 0,
        disponibles: 0
      };
    }
    grouped[isbn].total++;
    if (ex.disponibilite) grouped[isbn].disponibles++;
  });

  // Find matching book
  const book = Object.values(grouped).find((row) =>
    q.includes(normalize(row.titre)) || q.includes(normalize(row.auteur))
  );

  if (!book) {
    return null;
  }

  if (book.disponibles > 0) {
    return `"${book.titre}" par ${book.auteur}: ${book.disponibles} exemplaire(s) disponible(s) sur ${book.total}.`;
  } else {
    return `"${book.titre}" par ${book.auteur} est actuellement en rupture (${book.total} exemplaires au catalogue).`;
  }
}

/**
 * Answer: Books in a specific category
 */
async function answerBooksInCategory(question) {
  const categories = [
    'Fiction', 'Science-Fiction', 'Fantasy', 'Romance', 'Thriller',
    'Historique', 'Biographie', 'Education', 'Technique', 'Science',
    'Philosophie', 'Histoire', 'Art'
  ];

  const q = normalize(question);
  const category = categories.find(cat => q.includes(normalize(cat)));

  if (!category) {
    return null;
  }

  // Get books in category
  const { data: books, error: booksError } = await supabase
    .from('livre')
    .select('isbn, titre, auteur, categorie')
    .ilike('categorie', `%${category}%`)
    .limit(15);

  if (booksError) throw booksError;

  if (!books || books.length === 0) {
    return `Aucun livre trouvé dans la catégorie "${category}".`;
  }

  // Get exemplaire data for availability
  const { data: exemplaires, error: exError } = await supabase
    .from('exemplaire')
    .select('isbn, disponibilite');

  if (exError) throw exError;

  // Count available per ISBN
  const availability = {};
  exemplaires.forEach(ex => {
    if (!availability[ex.isbn]) {
      availability[ex.isbn] = { total: 0, disponibles: 0 };
    }
    availability[ex.isbn].total++;
    if (ex.disponibilite) availability[ex.isbn].disponibles++;
  });

  const lines = [`Livres de la catégorie "${category}" (${books.length} trouvé(s)):`, ''];
  books.forEach((b) => {
    const avail = availability[b.isbn];
    const status = avail && avail.disponibles > 0 ? `${avail.disponibles} disponible(s)` : 'En rupture';
    lines.push(`- "${b.titre}" par ${b.auteur} [${status}]`);
  });
  return lines.join('\n');
}

/**
 * Answer: Books by a specific author
 */
async function answerBooksByAuthor(question) {
  const q = normalize(question);
  
  // Get all authors and find match
  const { data: authorsData, error: authError } = await supabase
    .from('livre')
    .select('auteur')
    .order('auteur', { ascending: true });

  if (authError) throw authError;

  const uniqueAuthors = [...new Set(authorsData.map(row => row.auteur))];
  const author = uniqueAuthors.find((a) => q.includes(normalize(a)));

  if (!author) {
    return null;
  }

  // Get books by author with availability
  const { data: books, error: booksError } = await supabase
    .from('livre')
    .select('isbn, titre, auteur, categorie, annee')
    .eq('auteur', author)
    .order('annee', { ascending: false })
    .order('titre', { ascending: true });

  if (booksError) throw booksError;

  if (!books || books.length === 0) {
    return `Aucun livre trouvé de l'auteur "${author}".`;
  }

  // Get exemplaire data for availability
  const { data: exemplaires, error: exError } = await supabase
    .from('exemplaire')
    .select('isbn, disponibilite');

  if (exError) throw exError;

  // Count available per ISBN
  const availability = {};
  exemplaires.forEach(ex => {
    if (!availability[ex.isbn]) {
      availability[ex.isbn] = { total: 0, disponibles: 0 };
    }
    availability[ex.isbn].total++;
    if (ex.disponibilite) availability[ex.isbn].disponibles++;
  });

  const lines = [`Ouvrages de ${author} (${books.length} livre(s)):`, ''];
  books.forEach((b) => {
    const avail = availability[b.isbn];
    const status = avail && avail.disponibles > 0 ? `✓ ${avail.disponibles} dispo` : '✗ Rupture';
    const year = b.annee ? ` (${b.annee})` : '';
    lines.push(`- "${b.titre}"${year} [${status}]`);
  });
  return lines.join('\n');
}

/**
 * Answer: User's active loans
 */
async function answerMyLoans(question, userId) {
  if (!userId) {
    return "Veuillez vous connecter pour voir vos emprunts.";
  }

  // Get active loans with book info
  const { data: loans, error: loansError } = await supabase
    .from('emprunt')
    .select(`
      id_emprunt,
      date_emprunt,
      date_retour_prevue,
      date_retour_reelle,
      email_utilisateur,
      exemplaire(
        id_exemplaire,
        livre(
          isbn,
          titre,
          auteur
        )
      )
    `)
    .eq('email_utilisateur', userId)
    .is('date_retour_reelle', null)
    .order('date_retour_prevue', { ascending: true });

  if (loansError) throw loansError;

  if (!loans || loans.length === 0) {
    return "Vous n'avez aucun emprunt actif. Vous pouvez explorer notre catalogue!";
  }

  const lines = [`Vos emprunts actifs (${loans.length}):`, ''];
  loans.forEach((loan) => {
    const today = new Date();
    const dueDate = new Date(loan.date_retour_prevue);
    const isOverdue = dueDate < today;
    const overdue = isOverdue ? ' ⚠️ EN RETARD' : '';
    
    if (loan.exemplaire && loan.exemplaire.livre) {
      const book = loan.exemplaire.livre;
      lines.push(`- "${book.titre}" par ${book.auteur}`);
      lines.push(`  Retour prévu: ${loan.date_retour_prevue}${overdue}`);
    }
  });
  return lines.join('\n');
}

/**
 * Answer: Lending rules and policies
 */
async function answerLendingPolicy() {
  return `Politique de prêt de la bibliothèque:

📚 Durée standard: 14 jours
👥 Nombre de livres: Maximum 5 livres simultanément
⏰ Renouvellement: Possible 2 fois (28 jours supplémentaires)
🔴 Pénalités: 0.50€ par jour de retard
🚫 En cas de perte: Facturation du livre + frais administratifs

Pour plus d'informations, contactez l'équipe de la bibliothèque.`;
}

/**
 * Answer: Opening hours
 */
async function answerOpeningHours() {
  return `Horaires de la bibliothèque:

📍 Lundi - Vendredi: 8h00 - 19h00
📍 Samedi: 10h00 - 17h00
📍 Dimanche: Fermée

Accès 24/7 aux systèmes en ligne pour consulter et prolonger vos emprunts.`;
}

/**
 * Answer: How to reserve a book
 */
async function answerReservationProcess() {
  return `Comment réserver un livre:

1. Connectez-vous à votre compte étudiant
2. Cherchez le livre souhaité dans le catalogue
3. Cliquez sur "Réserver"
4. Vous serez notifié par email quand le livre sera disponible
5. Récupérez votre réservation dans les 7 jours

💡 Vous pouvez réserver jusqu'à 3 livres à la fois.`;
}

/**
 * Return all active FAQ entries (for the frontend quick-question chips)
 */
async function getFaq(req, res) {
  try {
    const faqs = await getAllFaq();
    res.json({ data: faqs });
  } catch (err) {
    console.error('[AI/FAQ] Error:', err.message);
    res.status(500).json({ message: 'Erreur lors du chargement des FAQ' });
  }
}

/**
 * Main assistant query handler
 */
async function queryAssistant(req, res) {
  try {
    const { question, userId } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question requise' });
    }

    // 0. Check FAQ table first — highest priority for predetermined Q&A
    try {
      const faqMatch = await findMatchingFaq(question);
      if (faqMatch) {
        return res.json({ answer: faqMatch.answer, source: 'faq', faq_id: faqMatch.id });
      }
    } catch (faqErr) {
      // FAQ table may not exist yet; fall through to pattern matching
      console.warn('[AI] FAQ lookup failed:', faqErr.message);
    }

    const normalized = normalize(String(question));

    // Pattern-based handlers with priority order

    // 1. Check lending policy questions
    if (
      normalized.includes('politique') ||
      normalized.includes('regle') ||
      normalized.includes('prêt') ||
      normalized.includes('loan')
    ) {
      const answer = answerLendingPolicy();
      return res.json({ answer });
    }

    // 2. Check opening hours questions
    if (
      normalized.includes('horaire') ||
      normalized.includes('ouvertur') ||
      normalized.includes('fermetur') ||
      normalized.includes('heure')
    ) {
      const answer = answerOpeningHours();
      return res.json({ answer });
    }

    // 3. Check reservation process questions
    if (
      normalized.includes('reserv') ||
      normalized.includes('comment reserv') ||
      normalized.includes('how to reserve')
    ) {
      const answer = answerReservationProcess();
      return res.json({ answer });
    }

    // 4. Check "my loans" questions
    if (normalized.includes('mes emprunt') || normalized.includes('my loan')) {
      const answer = await answerMyLoans(question, userId);
      return res.json({ answer });
    }

    // 5. Check for low stock/rupture questions
    if (
      normalized.includes('ruptur') ||
      normalized.includes('stock bas') ||
      normalized.includes('low stock') ||
      normalized.includes('out of stock')
    ) {
      const answer = await answerLowStock();
      return res.json({ answer });
    }

    // 5a. Check for category questions (BEFORE general books to be more specific)
    if (
      normalized.includes('categor') ||
      normalized.includes('genre') ||
      normalized.includes('domaine') ||
      normalized.includes('science-fiction') ||
      normalized.includes('sciencefiction') ||
      normalized.includes('fantasy') ||
      normalized.includes('romance') ||
      normalized.includes('thriller') ||
      normalized.includes('historique') ||
      normalized.includes('biographie')
    ) {
      const answer = await answerBooksInCategory(question);
      if (answer) {
        return res.json({ answer });
      }
    }

    // 5b. Check for author-specific questions (BEFORE general books)
    if (
      normalized.includes('auteur') ||
      normalized.includes('par ') ||
      normalized.includes('de ')
    ) {
      const answer = await answerBooksByAuthor(question);
      if (answer) {
        return res.json({ answer });
      }
    }

    // 5c. Check for stock/availability for specific book
    if (
      normalized.includes('stock') ||
      normalized.includes('disponib') ||
      normalized.includes('avail')
    ) {
      const answer = await answerAvailabilityForBook(question);
      if (answer) {
        return res.json({ answer });
      }
    }

    // 6. Check for general catalog/books questions (AFTER specific queries)
    if (
      normalized.includes('livr') ||
      normalized.includes('book') ||
      normalized.includes('catalog') ||
      normalized.includes('catalogue') ||
      normalized.includes('quels') ||
      normalized.includes('avez') ||
      normalized.includes('have')
    ) {
      try {
        // Get all books as fallback for general questions
        const { data: books, error } = await supabase
          .from('livre')
          .select('isbn, titre, auteur, categorie')
          .limit(10);
        
        if (!error && books && books.length > 0) {
          const lines = ['Voici quelques livres de notre bibliothèque:', ''];
          books.forEach((b) => {
            lines.push(`📖 "${b.titre}" par ${b.auteur} [${b.categorie}]`);
          });
          lines.push('');
          lines.push('Tapez une catégorie (ex: "Science-Fiction") ou un auteur pour plus de détails!');
          return res.json({ answer: lines.join('\n') });
        }
      } catch (e) {
        console.error('[AI] Error listing books:', e.message);
      }
    }

    // 7. Fallback: Generic helpful response
    const fallbackResponse = `Bienvenue à la Bibliothèque UHA! 📚

Je suis l'assistant IA de la bibliothèque. Je peux vous aider avec:
- 📖 Lister nos livres disponibles
- 🔍 Chercher des livres par auteur ou catégorie
- 📊 Vérifier la disponibilité de livres
- 📋 Voir vos emprunts actifs
- 📅 Horaires de la bibliothèque
- 🎫 Information sur les réservations

Comment puis-je vous aider?`;

    res.json({ answer: fallbackResponse });

  } catch (err) {
    console.error('[AI] Error:', err.message);
    res.status(500).json({ message: 'Erreur lors du traitement de la question', error: err.message });
  }
}

module.exports = {
  queryAssistant,
  getFaq,
};
