const { getSystemRules, toggleRule, getAdminUsers, getAdminMetrics } = require('../models/adminModel');

const fetchRules = async (req, res) => {
  try {
    const rules = await getSystemRules();
    res.json({ message: 'Règles système', data: rules });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de charger les règles', detail: err.message });
  }
};

const updateRuleActivation = async (req, res) => {
  const { ruleId } = req.params;
  const { active } = req.body;
  if (typeof active !== 'boolean') {
    return res.status(400).json({ error: 'La valeur "active" doit être un booléen' });
  }

  try {
    const updatedRule = await toggleRule(ruleId, active);
    res.json({ message: 'Règle mise à jour', data: updatedRule });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await getAdminUsers();
    res.json({ message: 'Comptes utilisateurs', data: users });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs', detail: err.message });
  }
};

const fetchMetrics = async (req, res) => {
  try {
    const metrics = await getAdminMetrics();
    res.json({ message: 'Statistiques administrateur', data: metrics });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les statistiques', detail: err.message });
  }
};

module.exports = {
  fetchRules,
  updateRuleActivation,
  fetchUsers,
  fetchMetrics,
};
