const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  session_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ChatSession', 
    required: true 
  },
  message: { 
    type: String, 
    required: true // Input dari user
  },
  response: { 
    type: String, 
    required: true // Balasan dari model AI
  },
  emotion: { 
    type: String, 
    enum: ['Senang', 'Sedih', 'Marah', 'Stres', 'Netral'], // Label klasifikasi AI
    default: 'Netral' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);