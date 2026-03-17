const express = require('express');
const router = express.Router();
const { fetchUsers, fetchMe } = require('../controllers/userController');

// --- AJOUT ICI : Import du middleware ---
const { verifyToken } = require('../middlewares/auth');

// GET /api/users/me -> PROTEGÉ par verifyToken
router.get('/me', verifyToken, fetchMe);

// GET /api/users -> Liste pour admin (Aussi protégé idéalement)
router.get('/', verifyToken, fetchUsers);

module.exports = router;