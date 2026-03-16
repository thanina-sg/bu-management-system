const express = require('express');
const router = express.Router();
const {
  fetchRules,
  updateRuleActivation,
  fetchUsers,
  fetchMetrics,
} = require('../controllers/adminController');

router.get('/rules', fetchRules);
router.put('/rules/:ruleId', updateRuleActivation);
router.get('/users', fetchUsers);
router.get('/metrics', fetchMetrics);

module.exports = router;
