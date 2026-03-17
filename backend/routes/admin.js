const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth'); 
const {
  fetchRules,
  updateRuleActivation,
  fetchUsers,
  fetchMetrics
} = require('../controllers/adminController');

// Vérifie que "isAdmin" n'est pas undefined ici
router.get('/rules', verifyToken, isAdmin, fetchRules);
router.put('/rules/:ruleId', verifyToken, isAdmin, updateRuleActivation);
router.get('/users', verifyToken, isAdmin, fetchUsers);
router.get('/metrics', verifyToken, isAdmin, fetchMetrics);

module.exports = router;