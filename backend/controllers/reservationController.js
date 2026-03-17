const ReservationModel = require('../models/reservationModel');

/**
 * GET /api/reservations
 * Un étudiant ne voit que SES réservations (via le Token)
 */
const getReservations = async (req, res) => {
  try {
    // ON UTILISE LE TOKEN
    const studentId = req.user.id; 
    const { status } = req.query;
    
    const reservations = await ReservationModel.listReservations(studentId, status);
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération', detail: err.message });
  }
};

/**
 * POST /api/reservations
 */
const createReservation = async (req, res) => {
  try {
    // ON UTILISE LE TOKEN (plus besoin de studentId dans le body)
    const studentId = req.user.id; 
    const { isbn } = req.body;
    
    if (!isbn) {
      return res.status(400).json({ error: "L'ISBN est requis." });
    }

    const newRes = await ReservationModel.insertReservation(studentId, isbn);
    res.status(201).json(newRes);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création', detail: err.message });
  }
};

/**
 * PUT /api/reservations/:id
 * Note : Seul un ADMIN devrait pouvoir changer le statut en "Ready"
 */
const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await ReservationModel.updateStatus(id, status);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour', detail: err.message });
  }
};

/**
 * DELETE /api/reservations/:id
 * Sécurité : Vérifier dans le modèle que la réservation appartient à req.user.id
 */
const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    await ReservationModel.deleteReservation(id);
    res.status(204).send(); 
  } catch (err) {
    res.status(500).json({ error: 'Erreur annulation', detail: err.message });
  }
};

module.exports = { 
  getReservations, 
  createReservation, 
  updateReservationStatus, 
  cancelReservation 
};