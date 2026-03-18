const express = require('express');
const router = express.Router();
const { queryAssistant, getFaq } = require('../controllers/aiController');

// GET /api/ai/faq — returns all active FAQ entries for the chat widget
router.get('/faq', getFaq);

// POST /api/ai/query — answers a natural-language question
router.post('/query', queryAssistant);

module.exports = router;