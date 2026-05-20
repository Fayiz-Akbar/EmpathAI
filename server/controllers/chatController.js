const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const axios = require('axios'); // WAJIB: Import axios untuk berkomunikasi dengan Python

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

// 2. Fungsi Mengirim Pesan & Mendapatkan Respon AI (TERINTEGRASI MODEL PYTHON)
exports.sendMessage = async (req, res) => {
  try {
    const { session_id, message } = req.body;

    // --- 1. KONSULTASI KE OTAK PYTHON (Model Deep Learning) ---
    let detectedEmotion = "Netral"; // Emosi default jika Python sedang down/gagal
    try {
      // Node.js menelepon FastAPI Python di port 5001
      const pythonResponse = await axios.post('http://127.0.0.1:5001/predict', { text: message });
      
      // Mengambil hasil prediksi ('marah', 'sedih', 'stres', dll)
      const rawEmotion = pythonResponse.data.emotion;
      
      // Rapikan huruf awalnya agar kapital (misal: 'stres' jadi 'Stres') untuk ditampilkan di UI
      detectedEmotion = rawEmotion.charAt(0).toUpperCase() + rawEmotion.slice(1); 
      
      console.log(`🤖 [EmpathAI] Model mendeteksi emosi: ${detectedEmotion}`);
    } catch (pyErr) {
      console.error("❌ Gagal menghubungi Server Python:", pyErr.message);
    }

    // --- 2. GENERATE BALASAN EMPATI ---
    // (Ini adalah template respons sementara sebelum kamu sambungkan ke LLM)
    let aiResponse = "";
    
    switch (detectedEmotion.toLowerCase()) {
      case 'marah':
        aiResponse = "Aku bisa merasakan kekesalanmu. Mengalami hal seperti itu memang sangat menyebalkan. Maukah kamu menceritakan lebih detail apa yang paling membuatmu marah?";
        break;
      case 'stres':
        aiResponse = "Beban yang kamu pikul pasti terasa berat. Ambil napas pelan-pelan. Ayo kita urai satu per satu, apa yang paling membebanimu saat ini?";
        break;
      case 'sedih':
        aiResponse = "Aku turut bersedih mendengarnya. Tidak apa-apa untuk merasa tidak baik-baik saja, menangis pun wajar. Aku di sini siap mendengarkanmu.";
        break;
      case 'senang':
        aiResponse = "Wah, ikut bahagia mendengarnya! Energi positifmu terasa sampai ke sini. Pertahankan semangat ini ya!";
        break;
      default:
        aiResponse = "Terima kasih sudah berbagi. Ceritakan lebih banyak agar aku bisa memahamimu dengan lebih baik.";
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
    console.error("Error di sendMessage:", error);
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

// 4. Fungsi Mengambil Semua Sesi Chat milik User
exports.getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Cari semua sesi milik user ini, urutkan dari yang terbaru (createdAt: -1)
    const sessions = await ChatSession.find({ user_id: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ data: sessions });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil daftar sesi', error });
  }
};

// 5. Fungsi Mengubah Judul Sesi (Rename)
exports.renameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    
    // Cari sesi dan update judulnya
    const updatedSession = await ChatSession.findByIdAndUpdate(
      sessionId, 
      { title }, 
      { new: true }
    );
    res.status(200).json({ message: 'Judul berhasil diubah', session: updatedSession });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah judul', error });
  }
};

// 6. Fungsi Menghapus Sesi (Delete)
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Hapus Sesi Utama
    await ChatSession.findByIdAndDelete(sessionId);
    // Hapus juga SELURUH pesan yang nyangkut di sesi tersebut agar database tidak sampah
    await ChatMessage.deleteMany({ session_id: sessionId }); 
    
    res.status(200).json({ message: 'Sesi dan riwayat obrolan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus sesi', error });
  }
};