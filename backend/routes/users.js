const express = require('express');
const router = express.Router();
const { getUsers, getMe, createNewUser, updateUserData, removeUser } = require('../controllers/userController');

// GET /api/users
router.get('/', getUsers);

// GET /api/users/me
router.get('/me', getMe);

// POST /api/users
router.post('/', createNewUser);

// PUT /api/users/:id
router.put('/:id', updateUserData);

// DELETE /api/users/:id
router.delete('/:id', removeUser);

module.exports = router;
