const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');

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

    // --- SIMULASI AI RULE-BASED ---
    let aiResponse = "Aku mendengarkanmu. Ceritakan lebih lanjut.";
    let detectedEmotion = "Netral";
    const textLower = message.toLowerCase();

    if (textLower.includes('stres') || textLower.includes('capek') || textLower.includes('burnout')) {
      aiResponse = "Kamu terlihat lelah, coba istirahat ya. Jangan terlalu dipaksakan.";
      detectedEmotion = "Stres";
    } else if (textLower.includes('sedih') || textLower.includes('kecewa')) {
      aiResponse = "Aku di sini untukmu. Menangis atau bersedih itu wajar kok.";
      detectedEmotion = "Sedih";
    } else if (textLower.includes('marah') || textLower.includes('kesal')) {
      aiResponse = "Tarik napas dalam-dalam. Mari tenangkan pikiran sejenak.";
      detectedEmotion = "Marah";
    } else if (textLower.includes('senang') || textLower.includes('lulus')) {
      aiResponse = "Wah, ikut bahagia mendengarnya! Pertahankan energi positif ini ya.";
      detectedEmotion = "Senang";
    }

    // Simpan pesan user dan respon AI ke database
    const newChat = new ChatMessage({
      session_id,
      message,
      response: aiResponse,
      emotion: detectedEmotion
    });

    await newChat.save();
    res.status(201).json({ message: 'Pesan terkirim', data: newChat });
  } catch (error) {
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