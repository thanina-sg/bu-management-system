const express = require('express');
const router = express.Router();

// On importe les nouvelles fonctions du controller
const { 
  getReservations, 
  createReservation, 
  updateReservationStatus, 
  cancelReservation 
} = require('../controllers/reservationController');

/**
 * ROUTES POUR LES RÉSERVATIONS (/api/reservations)
 */

// Route 1 : Liste les réservations (ex: GET /api/reservations?studentId=...)
router.get('/', getReservations);

// Route 2 : Créer une réservation (ex: POST /api/reservations)
router.post('/', createReservation);

// Route 3 : Modifier le statut (ex: PUT /api/reservations/12)
// Utilisé par le staff pour passer de 'Pending' à 'Ready'
router.put('/:id', updateReservationStatus);

// Route 4 : Annuler une réservation (ex: DELETE /api/reservations/12)
router.delete('/:id', cancelReservation);

module.exports = router;