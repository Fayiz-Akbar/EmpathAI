const express = require('express');
const router = express.Router();
// Import fungsi baru dari controller
const { createSession, sendMessage, getHistory, getUserSessions, renameSession, deleteSession } = require('../controllers/chatController');

router.post('/session', createSession);
router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.get('/sessions/:userId', getUserSessions); 

// Tambahkan 2 rute baru ini:
router.put('/sessions/:sessionId', renameSession);
router.delete('/sessions/:sessionId', deleteSession);

module.exports = router;