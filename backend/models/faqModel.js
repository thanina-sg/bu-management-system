const supabase = require('../db');

/**
 * Normalize text for keyword matching (lowercase, no accents)
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ── Fallback FAQ data (used when the `faq` table doesn't exist yet) ──────────
// To persist this data in Supabase, run:
//   1. backend/scripts/create-faq.sql  (in the Supabase SQL editor)
//   2. node backend/scripts/seed-faq.js

const FALLBACK_FAQ = [
  {
    id: 'faq-1',
    question: "Quels sont les horaires d'ouverture de la bibliothèque ?",
    answer: "La bibliothèque est ouverte :\n• Lundi – Vendredi : 8h00 – 19h00\n• Samedi : 10h00 – 17h00\n• Dimanche : Fermée\n\nL'accès en ligne (catalogue, prolongations, réservations) est disponible 24h/24, 7j/7.",
    mots_cles: ['horaire', 'ouverture', 'fermeture', 'heure', 'samedi', 'dimanche', 'lundi'],
    categorie: 'general',
    ordre: 1,
  },
  {
    id: 'faq-2',
    question: "Comment emprunter un livre ?",
    answer: "Pour emprunter un livre :\n1. Connectez-vous à votre compte étudiant\n2. Repérez le livre dans le catalogue\n3. Rendez-vous en bibliothèque avec votre carte étudiante\n4. Un bibliothécaire enregistre le prêt sur votre compte\n\nLes emprunts sont possibles sur les exemplaires marqués « Disponible ».",
    mots_cles: ['emprunter', 'emprunt', 'pret', 'preter', 'comment emprunter'],
    categorie: 'emprunts',
    ordre: 10,
  },
  {
    id: 'faq-3',
    question: "Combien de livres puis-je emprunter en même temps ?",
    answer: "Vous pouvez emprunter jusqu'à 5 livres simultanément.\n\nCe quota s'applique à tous les profils (étudiant, enseignant). En cas de besoin exceptionnel, contactez un bibliothécaire.",
    mots_cles: ['combien', 'quota', 'nombre', 'maximum', 'livres', 'simultanement'],
    categorie: 'emprunts',
    ordre: 11,
  },
  {
    id: 'faq-4',
    question: "Quelle est la durée d'un emprunt ?",
    answer: "La durée standard d'un emprunt est de 14 jours.\n\nVous pouvez renouveler jusqu'à 2 fois (soit 28 jours supplémentaires maximum), tant que le livre n'est pas réservé par un autre usager.",
    mots_cles: ['duree', 'combien', 'temps', 'jours', 'semaines', 'delai'],
    categorie: 'emprunts',
    ordre: 12,
  },
  {
    id: 'faq-5',
    question: "Comment prolonger un emprunt ?",
    answer: "Pour prolonger un emprunt :\n• Connectez-vous à votre espace personnel\n• Dans « Mes emprunts », cliquez sur « Prolonger »\n• La prolongation est accordée si le livre n'est pas réservé\n\nChaque renouvellement ajoute 14 jours. Maximum 2 renouvellements par emprunt.",
    mots_cles: ['prolonger', 'renouveler', 'prolongation', 'renouvellement'],
    categorie: 'emprunts',
    ordre: 13,
  },
  {
    id: 'faq-6',
    question: "Quelles sont les pénalités en cas de retard ?",
    answer: "En cas de retard :\n• 0,50 € par jour de retard par livre\n• Blocage du compte au-delà de 15 jours de retard\n• Régularisation nécessaire avant tout nouvel emprunt\n\nPensez à prolonger ou rapporter vos livres à temps.",
    mots_cles: ['penalite', 'retard', 'amende', 'frais', 'sanction', 'blocage'],
    categorie: 'emprunts',
    ordre: 14,
  },
  {
    id: 'faq-7',
    question: "Que faire si j'ai perdu ou abîmé un livre ?",
    answer: "En cas de perte ou de détérioration :\n1. Signalez-le immédiatement à un bibliothécaire\n2. Le coût de remplacement du livre vous sera facturé\n3. Des frais administratifs (5 €) s'ajoutent en cas de perte\n\nPlus tôt vous signalez le problème, mieux c'est.",
    mots_cles: ['perdu', 'abime', 'deteriore', 'endommage', 'perte', 'remplacement'],
    categorie: 'emprunts',
    ordre: 15,
  },
  {
    id: 'faq-8',
    question: "Comment réserver un livre indisponible ?",
    answer: "Pour réserver un livre actuellement emprunté :\n1. Connectez-vous à votre compte\n2. Ouvrez la fiche du livre dans le catalogue\n3. Cliquez sur « Réserver »\n4. Vous serez notifié dès que le livre est rendu\n5. Vous avez 7 jours pour le récupérer en bibliothèque",
    mots_cles: ['reserver', 'reservation', 'comment reserver', 'indisponible', 'file attente'],
    categorie: 'reservations',
    ordre: 20,
  },
  {
    id: 'faq-9',
    question: "Combien de livres puis-je réserver ?",
    answer: "Vous pouvez avoir jusqu'à 3 réservations actives simultanément.\n\nUne réservation expire automatiquement si vous ne récupérez pas le livre dans les 7 jours.",
    mots_cles: ['combien', 'reservation', 'nombre', 'maximum', 'simultanement'],
    categorie: 'reservations',
    ordre: 21,
  },
  {
    id: 'faq-10',
    question: "Comment annuler une réservation ?",
    answer: "Pour annuler une réservation :\n• Connectez-vous à votre espace personnel\n• Allez dans l'onglet « Mes réservations »\n• Cliquez sur « Annuler » à côté de la réservation\n\nL'annulation est immédiate.",
    mots_cles: ['annuler', 'annulation', 'supprimer', 'reservation'],
    categorie: 'reservations',
    ordre: 22,
  },
  {
    id: 'faq-11',
    question: "Comment m'inscrire à la bibliothèque ?",
    answer: "L'inscription est automatique pour tous les étudiants et enseignants de l'UHA.\n\nVotre compte est créé par l'administration avec votre email universitaire (@uha.fr). Contactez un bibliothécaire si votre compte n'existe pas encore.",
    mots_cles: ['inscription', 'inscrire', 'creer', 'compte', 'nouveau'],
    categorie: 'compte',
    ordre: 30,
  },
  {
    id: 'faq-12',
    question: "J'ai oublié mon mot de passe, que faire ?",
    answer: "Pour réinitialiser votre mot de passe :\n1. Contactez un bibliothécaire en personne ou par email\n2. Présentez votre carte étudiante pour vérification\n3. Un nouveau mot de passe temporaire vous sera fourni\n\nContact : bibliotheque@uha.fr",
    mots_cles: ['mot de passe', 'oublie', 'reinitialiser', 'connexion', 'identifiant'],
    categorie: 'compte',
    ordre: 31,
  },
  {
    id: 'faq-13',
    question: "Comment rechercher un livre dans le catalogue ?",
    answer: "Plusieurs façons de trouver un livre :\n• Barre de recherche : tapez le titre, l'auteur ou l'ISBN\n• Filtres : utilisez la catégorie (Roman, Science, Technique…)\n• Filtre disponibilité : n'affichez que les livres disponibles\n\nLe catalogue est accessible sans connexion.",
    mots_cles: ['rechercher', 'chercher', 'trouver', 'catalogue', 'titre', 'auteur', 'isbn'],
    categorie: 'catalogue',
    ordre: 40,
  },
  {
    id: 'faq-14',
    question: "Quelles catégories de livres sont disponibles ?",
    answer: "La bibliothèque couvre :\nFiction · Science-Fiction · Fantasy · Romance · Thriller\nHistorique · Biographie · Éducation · Technique\nScience · Philosophie · Histoire · Art\n\nUtilisez le filtre « Catégorie » dans le catalogue pour explorer.",
    mots_cles: ['categorie', 'genre', 'type', 'domaine', 'rayon'],
    categorie: 'catalogue',
    ordre: 41,
  },
  {
    id: 'faq-15',
    question: "Quels services propose la bibliothèque ?",
    answer: "La bibliothèque UHA propose :\n📚 Prêt de livres et documents\n🔍 Aide à la recherche documentaire\n💻 Postes informatiques et Wi-Fi gratuit\n📖 Salles de travail en groupe\n🖨️ Impression et photocopie\n📰 Accès aux revues et journaux\n🎓 Formations aux outils de recherche",
    mots_cles: ['service', 'propose', 'offre', 'disponible', 'wifi', 'impression', 'salle'],
    categorie: 'general',
    ordre: 50,
  },
  {
    id: 'faq-16',
    question: "Comment contacter la bibliothèque ?",
    answer: "Pour nous contacter :\n📧 Email : bibliotheque@uha.fr\n📞 Téléphone : 03 89 33 60 00\n🏢 Accueil : Bâtiment principal, rez-de-chaussée\n\nNous répondons sous 24h ouvrées.",
    mots_cles: ['contact', 'email', 'telephone', 'adresse', 'joindre', 'aide'],
    categorie: 'general',
    ordre: 51,
  },
  {
    id: 'faq-17',
    question: "Peut-on accéder aux ressources numériques ?",
    answer: "Oui. La bibliothèque UHA donne accès à :\n• Des bases de données académiques (via ENT UHA)\n• Des revues scientifiques en ligne\n• Des livres numériques (e-books)\n\nCes ressources sont accessibles avec vos identifiants ENT.",
    mots_cles: ['numerique', 'ebook', 'enligne', 'ressource', 'digital', 'ent', 'base de donnee'],
    categorie: 'catalogue',
    ordre: 42,
  },
  {
    id: 'faq-18',
    question: "Existe-t-il des salles de travail en groupe ?",
    answer: "Oui, la bibliothèque dispose de 6 salles de travail en groupe (2 à 8 personnes).\n\nRéservation :\n• Sur place auprès de l'accueil\n• Par téléphone ou email\n• Maximum 3h par jour par groupe",
    mots_cles: ['salle', 'groupe', 'travail', 'reserver', 'espace', 'collaboratif'],
    categorie: 'general',
    ordre: 52,
  },
];

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Try to fetch from Supabase; fall back to FALLBACK_FAQ if the table is absent.
 */
async function withFallback(supabaseQuery) {
  try {
    const { data, error } = await supabaseQuery;
    if (error) {
      if (error.message?.includes('schema cache') || error.code === '42P01') {
        return null; // table missing → use fallback
      }
      throw new Error(error.message);
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Return all active FAQ entries ordered by ordre
 */
const getAllFaq = async () => {
  const data = await withFallback(
    supabase
      .from('faq')
      .select('id, question, answer, categorie, ordre')
      .eq('actif', true)
      .order('ordre', { ascending: true })
  );
  if (data !== null) return data;

  // fallback
  return FALLBACK_FAQ.map(({ id, question, answer, categorie, ordre }) => ({
    id,
    question,
    answer,
    categorie,
    ordre,
  }));
};

/**
 * Find the best-matching FAQ entry for a user question.
 */
const findMatchingFaq = async (question) => {
  const q = normalize(question);

  // Try DB first
  const data = await withFallback(
    supabase
      .from('faq')
      .select('id, question, answer, mots_cles, categorie')
      .eq('actif', true)
  );

  const source = data !== null ? data : FALLBACK_FAQ;
  if (!source || source.length === 0) return null;

  let best = null;
  let bestScore = 0;

  for (const faq of source) {
    const keywords = faq.mots_cles ?? [];
    const score = keywords.reduce(
      (acc, kw) => acc + (q.includes(normalize(kw)) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  // Require at least 2 keyword hits to avoid false positives from generic words
  return bestScore >= 2 ? best : null;
};

module.exports = { getAllFaq, findMatchingFaq, FALLBACK_FAQ };
