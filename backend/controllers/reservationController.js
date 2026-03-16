const { getAllReservations } = require('../models/reservationModel');

const fetchReservations = async (req, res) => {
  try {
    const reservations = await getAllReservations();
    res.json({ message: 'Liste des réservations', data: reservations });
  } catch (err) {
    res
      .status(500)
      .json({ error: 'Impossible de récupérer les réservations', detail: err.message });
  }
};

module.exports = {
  fetchReservations,
};
