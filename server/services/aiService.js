const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const { detectEmotion } = require('../services/aiService'); // Import penghubung ke Flask AI

// 1. Fungsi Membuat Sesi Chat Baru
exports.createSession = async (req, res) => {
  try {
    const { user_id, title } = req.body;
    
    const newSession = new ChatSession({
      user_id,
      title: title || 'Sesi Curhat Baru'
    });

    await newSession.save();
    res.status(201).json({ message: 'Sesi baru berhasil dibuat', session: newSession });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat sesi', error });
  }
};

// 2. Fungsi Mengirim Pesan & Mendapatkan Respon AI
exports.sendMessage = async (req, res) => {
  try {
    const { session_id, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Pesan tidak boleh kosong' });
    }

    // --- 1. PANGGIL MODEL AI PYTHON (Deteksi Emosi Sebenarnya) ---
    // Tidak lagi menebak dari kata kunci manual, melainkan dari model Machine Learning
    const detectedEmotion = await detectEmotion(message);
    
    // --- 2. SIAPKAN BALASAN SEMENTARA (Sebelum dipasang Gen AI / LLM) ---
    // Nanti bagian if-else ini akan dihapus sepenuhnya dan diganti dengan 1 baris kode panggilan API Gen AI
    let aiResponse = "Aku mendengarkanmu. Ceritakan lebih lanjut.";
    
    if (detectedEmotion === "stres") {
      aiResponse = "Kamu terlihat lelah, coba istirahat ya. Jangan terlalu dipaksakan.";
    } else if (detectedEmotion === "sedih") {
      aiResponse = "Aku di sini untukmu. Menangis atau bersedih itu wajar kok.";
    } else if (detectedEmotion === "marah") {
      aiResponse = "Tarik napas dalam-dalam. Mari tenangkan pikiran sejenak.";
    } else if (detectedEmotion === "senang") {
      aiResponse = "Wah, ikut bahagia mendengarnya! Pertahankan energi positif ini ya.";
    }

    // --- 3. SIMPAN KE DATABASE ---
    const newChat = new ChatMessage({
      session_id,
      message,
      response: aiResponse,
      emotion: detectedEmotion
    });

    await newChat.save();
    res.status(201).json({ message: 'Pesan terkirim', data: newChat });
  } catch (error) {
    console.error('Error di sendMessage:', error);
    res.status(500).json({ message: 'Gagal mengirim pesan', error });
  }
};

// 3. Fungsi Menarik Riwayat Chat dalam Satu Sesi
exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    // Mencari semua chat yang memiliki session_id yang sama, diurutkan dari yang terlama ke terbaru
    const history = await ChatMessage.find({ session_id: sessionId }).sort({ timestamp: 1 });
    
    res.status(200).json({ data: history });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil riwayat', error });
  }
};