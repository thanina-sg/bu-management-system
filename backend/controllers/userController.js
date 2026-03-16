const { getAllUsers } = require('../models/userModel');

const fetchUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ message: 'Liste des utilisateurs', data: users });
  } catch (err) {
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs', detail: err.message });
  }
};

module.exports = {
  fetchUsers,
};
