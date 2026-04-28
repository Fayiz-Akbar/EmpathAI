const express = require('express');
const router = express.Router();
const { createSession, sendMessage, getHistory } = require('../controllers/chatController');

router.post('/session', createSession);
router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);

module.exports = router;