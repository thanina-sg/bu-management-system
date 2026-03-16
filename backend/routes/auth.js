const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// --- 1. REGISTER (Test de création directe en base) ---
router.post('/register', register);

// --- 2. LOGIN (Simulé pour test) ---
router.post('/login', login);

module.exports = router;