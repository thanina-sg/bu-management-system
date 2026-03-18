const express = require('express');
const router = express.Router();
const { getAllReservations, createNewReservation, updateReservationStatus, cancelReservation } = require('../controllers/reservationController');
const { authenticateToken, requireRoles } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/reservations
router.get('/', getAllReservations);

// POST /api/reservations
router.post('/', requireRoles('ETUDIANT', 'ENSEIGNANT', 'BIBLIOTHECAIRE', 'ADMINISTRATEUR'), createNewReservation);

// PUT /api/reservations/:id
router.put('/:id', requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR', 'ETUDIANT', 'ENSEIGNANT'), updateReservationStatus);

// DELETE /api/reservations/:id
router.delete('/:id', requireRoles('BIBLIOTHECAIRE', 'ADMINISTRATEUR', 'ETUDIANT', 'ENSEIGNANT'), cancelReservation);

module.exports = router;
