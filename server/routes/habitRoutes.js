const express = require('express');
const router = express.Router();
const { getHabits, createHabit, deleteHabit, toggleHabit } = require('../controllers/habitController');
const authMiddleware = require('../middleware/authMiddleware');

// All habit routes require authentication
router.use(authMiddleware);

router.get('/', getHabits);
router.post('/', createHabit);
router.delete('/:id', deleteHabit);
router.patch('/:id/toggle', toggleHabit);

module.exports = router;
