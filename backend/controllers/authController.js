const { registerUser, loginStudent, loginStaff, logout, getCurrentUser } = require('../models/authModel');

const register = async (req, res) => {
    const { email, name, nom, prenom, role } = req.body;

    try {
        const user = await registerUser(email, nom || prenom, name || 'User', role);

        res.status(201).json({ 
            message: "User registered successfully",
            user
        });

    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(400).json({ error: err.message });
    }
};

const studentLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginStudent(email, password);
        res.json(result);

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(401).json({ error: err.message });
    }
};

const staffLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await loginStaff(email, password);
        res.json(result);

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(401).json({ error: "Staff access denied" });
    }
};

const userLogout = async (req, res) => {
    try {
        const result = await logout(req.headers.authorization);
        res.json(result);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getCurrentUserData = async (req, res) => {
    try {
        const userId = req.user?.id || req.body.userId;
        if (!userId) throw new Error("User ID required");

        const user = await getCurrentUser(userId);
        res.json(user);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    register,
    studentLogin,
    staffLogin,
    userLogout,
    getCurrentUserData
};
