const express = require('express');
const router = express.Router();
const { fetchEmprunts } = require('../controllers/empruntController');

router.get('/', fetchEmprunts);

module.exports = router;
