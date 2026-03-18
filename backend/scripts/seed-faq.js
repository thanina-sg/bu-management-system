/**
 * FAQ Seed Script
 *
 * Creates and populates the `faq` table with predetermined Q&A entries.
 *
 * Prerequisites:
 *   1. Run create-faq.sql in the Supabase SQL editor first.
 *   2. Ensure backend/.env has SUPABASE_URL and SUPABASE_KEY set.
 *
 * Usage:
 *   node backend/scripts/seed-faq.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const FAQ_ENTRIES = [
  // ── Horaires ─────────────────────────────────────────────────────────────
  {
    question: "Quels sont les horaires d'ouverture de la bibliothèque ?",
    answer:
      "La bibliothèque est ouverte :\n• Lundi – Vendredi : 8h00 – 19h00\n• Samedi : 10h00 – 17h00\n• Dimanche : Fermée\n\nL'accès en ligne (catalogue, prolongations, réservations) est disponible 24h/24, 7j/7.",
    mots_cles: ['horaire', 'ouverture', 'fermeture', 'heure', 'samedi', 'dimanche', 'lundi'],
    categorie: 'general',
    ordre: 1,
  },

  // ── Emprunts ─────────────────────────────────────────────────────────────
  {
    question: "Comment emprunter un livre ?",
    answer:
      "Pour emprunter un livre :\n1. Connectez-vous à votre compte étudiant\n2. Repérez le livre dans le catalogue\n3. Rendez-vous en bibliothèque avec votre carte étudiante\n4. Un bibliothécaire enregistre le prêt sur votre compte\n\nLes emprunts sont possibles sur les exemplaires marqués « Disponible ».",
    mots_cles: ['emprunter', 'emprunt', 'pret', 'preter', 'comment emprunter'],
    categorie: 'emprunts',
    ordre: 10,
  },
  {
    question: "Combien de livres puis-je emprunter en même temps ?",
    answer:
      "Vous pouvez emprunter jusqu'à 5 livres simultanément.\n\nCe quota s'applique à tous les profils (étudiant, enseignant). En cas de besoin exceptionnel, contactez un bibliothécaire.",
    mots_cles: ['combien', 'quota', 'nombre', 'maximum', 'livres', 'simultane'],
    categorie: 'emprunts',
    ordre: 11,
  },
  {
    question: "Quelle est la durée d'un emprunt ?",
    answer:
      "La durée standard d'un emprunt est de 14 jours.\n\nVous pouvez renouveler jusqu'à 2 fois (soit 28 jours supplémentaires maximum), tant que le livre n'est pas réservé par un autre usager.",
    mots_cles: ['durée', 'combien', 'temps', 'jours', 'semaines', 'delai'],
    categorie: 'emprunts',
    ordre: 12,
  },
  {
    question: "Comment prolonger un emprunt ?",
    answer:
      "Pour prolonger un emprunt :\n• Connectez-vous à votre espace personnel\n• Dans « Mes emprunts », cliquez sur « Prolonger »\n• La prolongation est accordée automatiquement si le livre n'est pas réservé\n\nChaque renouvellement ajoute 14 jours. Maximum 2 renouvellements par emprunt.",
    mots_cles: ['prolonger', 'renouveler', 'prolongation', 'renouvellement'],
    categorie: 'emprunts',
    ordre: 13,
  },
  {
    question: "Quelles sont les pénalités en cas de retard ?",
    answer:
      "En cas de retard :\n• 0,50 € par jour de retard par livre\n• Blocage du compte au-delà de 15 jours de retard\n• Régularisation nécessaire avant tout nouvel emprunt\n\nPour éviter les pénalités, pensez à prolonger ou rapporter vos livres à temps.",
    mots_cles: ['penalite', 'retard', 'amende', 'frais', 'sanction', 'blocage'],
    categorie: 'emprunts',
    ordre: 14,
  },
  {
    question: "Que faire si j'ai perdu ou abîmé un livre ?",
    answer:
      "En cas de perte ou de détérioration :\n1. Signalez-le immédiatement à un bibliothécaire\n2. Le coût de remplacement du livre vous sera facturé\n3. Des frais administratifs (5 €) s'ajoutent en cas de perte\n\nPlus tôt vous signalez le problème, plus la situation est facilitée.",
    mots_cles: ['perdu', 'abîmé', 'deteriore', 'endommage', 'perte', 'remplacement'],
    categorie: 'emprunts',
    ordre: 15,
  },

  // ── Réservations ─────────────────────────────────────────────────────────
  {
    question: "Comment réserver un livre indisponible ?",
    answer:
      "Pour réserver un livre actuellement emprunté :\n1. Connectez-vous à votre compte\n2. Ouvrez la fiche du livre dans le catalogue\n3. Cliquez sur « Réserver »\n4. Vous serez notifié dès que le livre est rendu\n5. Vous avez 7 jours pour le récupérer en bibliothèque",
    mots_cles: ['reserver', 'reservation', 'comment reserver', 'indisponible', 'file attente'],
    categorie: 'reservations',
    ordre: 20,
  },
  {
    question: "Combien de livres puis-je réserver ?",
    answer:
      "Vous pouvez avoir jusqu'à 3 réservations actives simultanément.\n\nUne réservation expire automatiquement si vous ne récupérez pas le livre dans les 7 jours suivant la notification de disponibilité.",
    mots_cles: ['combien', 'reservation', 'nombre', 'maximum', 'simultanement'],
    categorie: 'reservations',
    ordre: 21,
  },
  {
    question: "Comment annuler une réservation ?",
    answer:
      "Pour annuler une réservation :\n• Connectez-vous à votre espace personnel\n• Allez dans l'onglet « Mes réservations »\n• Cliquez sur « Annuler » à côté de la réservation concernée\n\nL'annulation est immédiate et le livre passe au suivant dans la file d'attente.",
    mots_cles: ['annuler', 'annulation', 'supprimer', 'reservation'],
    categorie: 'reservations',
    ordre: 22,
  },

  // ── Compte & Inscription ──────────────────────────────────────────────────
  {
    question: "Comment m'inscrire à la bibliothèque ?",
    answer:
      "L'inscription est automatique pour tous les étudiants et enseignants de l'UHA.\n\nVotre compte est créé par l'administration avec votre email universitaire (@uha.fr). Contactez un bibliothécaire si votre compte n'existe pas encore.",
    mots_cles: ['inscription', 'inscrire', 'creer', 'compte', 'nouveau'],
    categorie: 'compte',
    ordre: 30,
  },
  {
    question: "J'ai oublié mon mot de passe, que faire ?",
    answer:
      "Pour réinitialiser votre mot de passe :\n1. Contactez un bibliothécaire en personne ou par email\n2. Présentez votre carte étudiante pour vérification d'identité\n3. Un nouveau mot de passe temporaire vous sera fourni\n\nContact : bibliotheque@uha.fr",
    mots_cles: ['mot de passe', 'oublie', 'reinitialiser', 'connexion', 'identifiant'],
    categorie: 'compte',
    ordre: 31,
  },
  {
    question: "Ai-je besoin de ma carte étudiante ?",
    answer:
      "Oui, la carte étudiante (ou carte d'enseignant) est requise :\n• Pour emprunter des livres en présentiel\n• Pour accéder aux salles de travail réservées\n\nPour les services en ligne (catalogue, réservations, prolongations), seule la connexion à votre compte est nécessaire.",
    mots_cles: ['carte', 'etudiant', 'identite', 'identifiant', 'presentiel'],
    categorie: 'compte',
    ordre: 32,
  },

  // ── Catalogue & Recherche ─────────────────────────────────────────────────
  {
    question: "Comment rechercher un livre dans le catalogue ?",
    answer:
      "Plusieurs façons de trouver un livre :\n• Barre de recherche : tapez le titre, l'auteur ou l'ISBN\n• Filtres : utilisez la catégorie (Roman, Science, Technique…)\n• Filtre disponibilité : n'affichez que les livres disponibles\n\nLe catalogue est accessible sans connexion depuis la page d'accueil.",
    mots_cles: ['rechercher', 'chercher', 'trouver', 'catalogue', 'titre', 'auteur', 'isbn'],
    categorie: 'catalogue',
    ordre: 40,
  },
  {
    question: "Quelles catégories de livres sont disponibles ?",
    answer:
      "La bibliothèque couvre les catégories suivantes :\nFiction · Science-Fiction · Fantasy · Romance · Thriller\nHistorique · Biographie · Éducation · Technique\nScience · Philosophie · Histoire · Art\n\nUtilisez le filtre « Catégorie » dans le catalogue pour explorer chaque domaine.",
    mots_cles: ['categorie', 'genre', 'type', 'domaine', 'rayon'],
    categorie: 'catalogue',
    ordre: 41,
  },
  {
    question: "Peut-on accéder aux ressources numériques ?",
    answer:
      "Oui. La bibliothèque UHA donne accès à :\n• Des bases de données académiques (via ENT UHA)\n• Des revues scientifiques en ligne\n• Des livres numériques (e-books)\n\nCes ressources sont accessibles avec vos identifiants ENT depuis le portail universitaire.",
    mots_cles: ['numerique', 'ebook', 'enligne', 'ressource', 'digital', 'ent', 'base de donnee'],
    categorie: 'catalogue',
    ordre: 42,
  },

  // ── Services ─────────────────────────────────────────────────────────────
  {
    question: "Quels services propose la bibliothèque ?",
    answer:
      "La bibliothèque UHA propose :\n📚 Prêt de livres et documents\n🔍 Aide à la recherche documentaire\n💻 Postes informatiques et Wi-Fi gratuit\n📖 Salles de travail en groupe\n🖨️ Impression et photocopie\n📰 Accès aux revues et journaux\n🎓 Formations aux outils de recherche",
    mots_cles: ['service', 'propose', 'offre', 'disponible', 'wifi', 'impression', 'salle'],
    categorie: 'general',
    ordre: 50,
  },
  {
    question: "Comment contacter la bibliothèque ?",
    answer:
      "Pour nous contacter :\n📧 Email : bibliotheque@uha.fr\n📞 Téléphone : 03 89 33 60 00\n🏢 Accueil : Bâtiment principal, rez-de-chaussée\n\nEn dehors des heures d'ouverture, vous pouvez nous laisser un message et nous vous répondons sous 24h ouvrées.",
    mots_cles: ['contact', 'email', 'telephone', 'adresse', 'joindre', 'aide'],
    categorie: 'general',
    ordre: 51,
  },
  {
    question: "Existe-t-il des salles de travail en groupe ?",
    answer:
      "Oui, la bibliothèque dispose de 6 salles de travail en groupe (2 à 8 personnes).\n\nRéservation :\n• Sur place auprès de l'accueil\n• Par téléphone ou email\n• Maximum 3h par jour par groupe\n\nLes salles sont disponibles aux horaires d'ouverture, sans réservation en ligne pour le moment.",
    mots_cles: ['salle', 'groupe', 'travail', 'reserver', 'espace', 'collaboratif'],
    categorie: 'general',
    ordre: 52,
  },
];

async function seed() {
  console.log('🌱  Seeding FAQ table...\n');

  // Clear existing entries then insert fresh
  await supabase.from('faq').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  const { data, error } = await supabase
    .from('faq')
    .insert(FAQ_ENTRIES)
    .select('id, question');

  if (error) {
    console.error('❌  Error seeding FAQ:', error.message);
    console.error('   Make sure you ran create-faq.sql in Supabase first.');
    process.exit(1);
  }

  console.log(`✅  Seeded ${data.length} FAQ entries:\n`);
  data.forEach(({ question }) => console.log(`   • ${question}`));
  console.log('\nDone.');
  process.exit(0);
}

seed();
