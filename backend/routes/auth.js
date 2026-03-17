const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ces routes doivent rester PUBLIQUES
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;