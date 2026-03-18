const supabase = require('../db');

const DEFAULT_RULES = [
  {
    id: 'rule-1',
    title: 'Validation automatique des emprunts',
    description: 'Limiter les emprunts après 22h tant que les quotas ne sont pas mis à jour.',
    active: true,
  },
  {
    id: 'rule-2',
    title: 'Règles de catalogage',
    description: 'Les notices doivent suivre le référentiel BIB-2026 pour être validées.',
    active: true,
  },
  {
    id: 'rule-3',
    title: 'Alertes de retard',
    description: 'Activer l’envoi automatique 3 jours avant la date de retour prévue.',
    active: false,
  },
];

const ROLE_PRIVILEGES = {
  ADMINISTRATEUR: ['Gérer les comptes', 'Configurer les règles', 'Superviser les emprunts'],
  BIBLIOTHECAIRE: ['Gérer les emprunts', 'Notifier les usagers', 'Préparer les réservations'],
  ENSEIGNANT: ['Accès lecture', 'Réserver des salles', 'Gérer les emprunts personnels'],
  ETUDIANT: ['Consulter le catalogue', 'Réserver des livres'],
};

const formatPrivileges = (role) => {
  if (!role) return ROLE_PRIVILEGES.ETUDIANT;
  const normalized = role.toUpperCase();
  return ROLE_PRIVILEGES[normalized] ?? ['Accès restreint'];
};

const formatRoleLabel = (role) => {
  if (!role) return 'Utilisateur';
  const mapping = {
    ADMINISTRATEUR: 'Administrateur',
    BIBLIOTHECAIRE: 'Bibliothécaire',
    ENSEIGNANT: 'Enseignant',
    ETUDIANT: 'Étudiant',
  };
  return mapping[role.toUpperCase()] ?? role;
};

const rulesState = DEFAULT_RULES.map((rule) => ({ ...rule }));

const getSystemRules = async () => {
  return rulesState;
};

const toggleRule = async (ruleId, active) => {
  const index = rulesState.findIndex((rule) => rule.id === ruleId);
  if (index === -1) {
    throw new Error('Règle introuvable');
  }
  rulesState[index].active = active;
  return rulesState[index];
};

const getAdminUsers = async () => {
  const { data, error } = await supabase
    .from('utilisateur')
    .select('id, nom, prenom, email, role, statut');
  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((user) => ({
    id: user.id,
    fullName: `${user.nom} ${user.prenom}`,
    email: user.email,
    role: formatRoleLabel(user.role),
    status: user.statut,
    privileges: formatPrivileges(user.role),
  }));
};

const PRIMARY_KEYS = { livre: 'isbn' };

const countRows = async (table, applyFilter) => {
  const pk = PRIMARY_KEYS[table] ?? 'id';
  let query = supabase.from(table).select(pk, { count: 'exact', head: true });
  if (applyFilter) {
    query = applyFilter(query);
  }

  const { count, error } = await query;
  if (error) {
    throw new Error(error.message);
  }
  return count ?? 0;
};

const getAdminMetrics = async () => {
  const [totalBooks, activeEmprunts, totalUsers, administrators, librarians] = await Promise.all([
    countRows('livre'),
    countRows('emprunt', (query) => query.is('date_retour_reelle', null)),
    countRows('utilisateur'),
    countRows('utilisateur', (query) => query.eq('role', 'ADMINISTRATEUR')),
    countRows('utilisateur', (query) => query.eq('role', 'BIBLIOTHECAIRE')),
  ]);

  return {
    totalBooks,
    activeEmprunts,
    totalUsers,
    administrators,
    librarians,
  };
};

module.exports = {
  getSystemRules,
  toggleRule,
  getAdminUsers,
  getAdminMetrics,
};
