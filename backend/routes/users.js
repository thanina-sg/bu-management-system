const express = require('express');
const router = express.Router();
const { getUsers, getMe, createNewUser, updateUserData, removeUser } = require('../controllers/userController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/users
router.get('/', requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR'), getUsers);

// GET /api/users/me
router.get('/me', getMe);

// POST /api/users
router.post('/', requireRoles('ADMINISTRATEUR'), createNewUser);

// PUT /api/users/:id
router.put('/:id', requireRoles('ADMINISTRATEUR'), updateUserData);

// DELETE /api/users/:id
router.delete('/:id', requireRoles('ADMINISTRATEUR'), removeUser);

module.exports = router;
