const express = require('express');
const router = express.Router();
// Import fungsi baru dari controller
const { createSession, sendMessage, getHistory, getUserSessions, renameSession, deleteSession, pinSession } = require('../controllers/chatController');

router.post('/session', createSession);
router.post('/message', sendMessage);
router.get('/history/:sessionId', getHistory);
router.get('/sessions/:userId', getUserSessions); 

// Tambahkan 2 rute baru ini:
router.put('/sessions/:sessionId', renameSession);
router.put('/sessions/:sessionId/pin', pinSession);
router.delete('/sessions/:sessionId', deleteSession);

module.exports = router;