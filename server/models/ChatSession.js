const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Berelasi dengan tabel User
    required: true 
  },
  title: { 
    type: String, 
    default: 'Obrolan Baru' // Nanti bisa di-update otomatis berdasarkan chat pertama
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);