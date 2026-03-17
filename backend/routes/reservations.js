const express = require('express');
const router = express.Router();
const { getAllReservations, createNewReservation, updateReservationStatus, cancelReservation } = require('../controllers/reservationController');

// GET /api/reservations
router.get('/', getAllReservations);

// POST /api/reservations
router.post('/', createNewReservation);

// PUT /api/reservations/:id
router.put('/:id', updateReservationStatus);

// DELETE /api/reservations/:id
router.delete('/:id', cancelReservation);

module.exports = router;
