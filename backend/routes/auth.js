const express = require('express');
const router = express.Router();
const { register, studentLogin, staffLogin, userLogout, getCurrentUserData } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/student/login
router.post('/student/login', studentLogin);

// POST /api/auth/staff/login
router.post('/staff/login', staffLogin);

// POST /api/auth/logout
router.post('/logout', userLogout);

// GET /api/auth/me (compatibility)
router.get('/me', authenticateToken, getCurrentUserData);

// POST /api/auth/register
router.post('/register', register);

module.exports = router;
