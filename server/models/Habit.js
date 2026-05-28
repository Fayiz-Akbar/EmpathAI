const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Target'
  },
  // We store dates as exact local date strings (e.g., "YYYY-MM-DD")
  // to prevent timezone offset bugs when a user completes a habit late at night.
  completedDates: [{
    type: String
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Habit', habitSchema);
