const express = require('express');
const router = express.Router();
const { createSession, sendMessage, getHistory } = require('../controllers/chatController');
const auth = require('../middleware/authMiddleware'); // <-- IMPORT GEMBOKNYA

// Selipkan variabel 'auth' di tengah-tengah untuk mengamankan jalurnya
router.post('/session', auth, createSession);
router.post('/message', auth, sendMessage);
router.get('/history/:sessionId', auth, getHistory);

module.exports = router;