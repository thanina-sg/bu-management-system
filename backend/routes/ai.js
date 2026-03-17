const express = require('express');
const router = express.Router();
const { queryAssistant } = require('../controllers/aiController');

/**
 * POST /api/ai/query
 * Query the AI assistant with a natural language question
 * 
 * Request body:
 * {
 *   "question": "string - the question to ask",
 *   "userId": "string (optional) - user UUID for personalized answers"
 * }
 * 
 * Response:
 * {
 *   "answer": "string - the assistant's response"
 * }
 */
router.post('/query', queryAssistant);

module.exports = router;