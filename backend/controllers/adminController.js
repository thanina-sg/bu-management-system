const AdminModel = require('../models/adminModel');

/**
 * GET /admin/rules
 * Récupère les règles du système
 */
const fetchRules = async (req, res) => {
  try {
    const rules = await AdminModel.getSystemRules();
    res.status(200).json(rules);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de charger les règles', detail: err.message });
  }
};

/**
 * PUT /admin/rules/:ruleId
 * Active ou désactive une règle
 */
const updateRuleActivation = async (req, res) => {
  const { ruleId } = req.params;
  const { active } = req.body;

  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: 'La valeur "active" doit être un booléen' });
  }

  try {
    const updatedRule = await AdminModel.toggleRule(ruleId, active);
    res.status(200).json(updatedRule);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/**
 * GET /admin/users
 * Liste les utilisateurs pour l'interface Admin
 */
const fetchUsers = async (req, res) => {
  try {
    const users = await AdminModel.getAdminUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs', detail: err.message });
  }
};

/**
 * GET /admin/metrics
 * Statistiques globales du tableau de bord
 */
const fetchMetrics = async (req, res) => {
  try {
    const metrics = await AdminModel.getAdminMetrics();
    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les statistiques', detail: err.message });
  }
};

// Exportation CLAIRE et NETTE pour éviter les erreurs "Undefined" dans les routes
module.exports = {
  fetchRules,
  updateRuleActivation,
  fetchUsers,
  fetchMetrics
};