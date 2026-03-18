const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

// GET /api/stats
router.get('/', authenticateToken, requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), getStats);

module.exports = router;
