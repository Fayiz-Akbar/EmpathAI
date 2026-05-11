const express = require('express');
const router = express.Router();
const { register, login, updateTheme } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/theme', authMiddleware, updateTheme);

module.exports = router;