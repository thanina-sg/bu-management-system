const express = require('express');
const router = express.Router();
const { fetchReservations } = require('../controllers/reservationController');

router.get('/', fetchReservations);

module.exports = router;
