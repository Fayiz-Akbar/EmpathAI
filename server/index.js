const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Koneksi ke MongoDB
// Pastikan variabel MONGODB_URI sudah ada di file .env kamu
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log(' Terhubung ke MongoDB dengan sukses!'))
  .catch((err) => console.error(' Gagal terhubung ke MongoDB:', err));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


// Route Dasar untuk Testing
app.get('/', (req, res) => {
  res.send('Server EmpathAI API sedang berjalan...');
});

// Menjalankan Server
app.listen(PORT, () => {
  console.log(` Server backend aktif di: http://localhost:${PORT}`);
});