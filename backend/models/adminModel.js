const supabase = require('../db');

// ... (Garder DEFAULT_RULES, ROLE_PRIVILEGES, formatPrivileges, formatRoleLabel et rulesState tels quels) ...

const getSystemRules = async () => {
  return rulesState;
};

const toggleRule = async (ruleId, active) => {
  const index = rulesState.findIndex((rule) => rule.id === ruleId);
  if (index === -1) throw new Error('Règle introuvable');
  rulesState[index].active = active;
  return rulesState[index];
};

const getAdminUsers = async () => {
  // On récupère l'utilisateur ET ses emprunts non rendus pour le statut
  const { data, error } = await supabase
    .from('utilisateur')
    .select(`
      id:id, 
      nom, 
      prenom, 
      email, 
      role, 
      emprunt(id_emprunt)
    `)
    .is('emprunt.date_retour_reelle', null); 

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((user) => {
    // Calcul du statut dynamique
    const aEmprunte = user.emprunt && user.emprunt.length > 0;

    return {
      id: user.id,
      fullName: `${user.nom} ${user.prenom}`, // Format AdminUser Swagger
      email: user.email,
      role: formatRoleLabel(user.role),
      status: aEmprunte ? "EMPRUNTEUR" : "ACTIF", // Ta règle métier
      privileges: formatPrivileges(user.role),
    };
  });
};

const countRows = async (table, applyFilter) => {
  // On utilise count: 'exact' pour les metrics
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (applyFilter) query = applyFilter(query);

  const { count, error } = await query;
  if (error) throw new Error(error.message);
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