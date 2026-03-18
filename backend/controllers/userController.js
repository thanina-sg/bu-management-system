const { getAllUsers, getCurrentUser, createUser, updateUser, deleteUser } = require('../models/userModel');

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) throw new Error("User ID required");

        const user = await getCurrentUser(userId);
        res.json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createNewUser = async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateUserData = async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const removeUser = async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.sendStatus(204);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getUsers,
    getMe,
    createNewUser,
    updateUserData,
    removeUser
};
