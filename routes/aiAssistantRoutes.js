const express = require('express');
const router = express.Router();
const assistantController = require('../controllers/assistantController');
const authenticate = require('../middleware/authenticate');

// POST /api/assistant/ask
router.post('/ask', authenticate, assistantController.askAssistant);

module.exports = router;

