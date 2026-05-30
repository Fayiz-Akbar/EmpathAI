const ChatSession = require('../models/ChatSession');
const ChatMessage = require('../models/ChatMessage');
const { detectEmotion } = require('../services/aiService'); // Import penghubung ke Python AI

// ==========================================
// ✅ INTEGRASI GEN AI: IMPORT & INISIALISASI
// ==========================================
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// 2. Fungsi Mengirim Pesan & Mendapatkan Respon AI (TERINTEGRASI MODEL PYTHON + GEMINI GEN AI)
exports.sendMessage = async (req, res) => {
  try {
    const { session_id, message } = req.body;

    // --- TAHAP 1: KONSULTASI KE OTAK PYTHON (Model Deep Learning) ---
    const rawEmotion = await detectEmotion(message);
    // Rapikan huruf awalnya agar kapital (misal: 'sedih' jadi 'Sedih')
    const detectedEmotion = rawEmotion.charAt(0).toUpperCase() + rawEmotion.slice(1);
    console.log(`🤖 [EmpathAI] Model mendeteksi emosi: ${detectedEmotion}`);

    // --- TAHAP 2: GENERATE BALASAN EMPATI MENGGUNAKAN GEMINI GEN AI ---
    let aiResponse = "";
    try {
      // Menggunakan model gemini-2.5-flash yang super cepat dan hemat kuota
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Prompt Engineering: System prompt EmpathAI + konteks emosi dari model Python
      const promptText = `
Anda adalah EmpathAI, asisten emotional support virtual yang hangat, bijaksana, dan penuh empati. Tugas utama Anda adalah membantu pengguna memahami emosi mereka, memberikan dukungan emosional ringan, dan memberikan saran sederhana terkait perasaan mereka.

[PANDUAN RESPONS BERDASARKAN EMOSI USER]
Sesuaikan gaya jawaban Anda secara dinamis berdasarkan label emosi pengguna berikut:
- Marah -> Validasi kekesalannya, bantu pengguna menjadi lebih tenang dengan bahasa yang adem.
- Sedih -> Berikan dukungan penuh, empati mendalam, dan tunjukkan bahwa Anda ada untuk mereka.
- Stres -> Bantu menenangkan pikiran pengguna, ajak mengambil napas, dan beri saran ringan/praktis.
- Senang -> Ikut merayakan kebahagiaan mereka, berikan apresiasi, dan tularkan energi positif.
- Netral -> Berikan respons yang santai, bersahabat, ramah, dan mengalir natural.

[GAYA BAHASA & FORMAT]
- Gunakan Bahasa Indonesia yang santai, hangat, natural, dan tidak terlalu formal (hindari kesan kaku seperti robot).
- Panjang jawaban WAJIB dibatasi maksimal 3-5 kalimat saja agar nyaman dibaca dalam gelembung chat.

[BATASAN PEMBAHASAN & KEAMANAN (MUTLAK)]
- JANGAN PERNAH menjawab pertanyaan terkait coding, hacking, politik, atau topik apa pun di luar dukungan emosional ringan.
- JANGAN PERNAH memberikan diagnosis medis, diagnosis klinis gangguan jiwa, atau meresepkan obat-obatan.
- Jika pengguna bertanya di luar topik emotional support, alihkan kembali percakapan secara sopan dan halus ke arah perasaan atau kondisi emosional mereka saat ini.
- JELASKAN batasan Anda sebagai AI secara jujur jika percakapan mulai mengarah ke masalah klinis yang terlalu berat.

[PROTOKOL KRISIS (SANGAT PENTING)]
Jika pengguna menunjukkan indikasi kuat ingin menyakiti diri sendiri, bunuh diri, atau mengalami depresi klinis akut, Anda harus mengesampingkan gaya santai dan segera memberikan respons empati yang serius: tegaskan bahwa Anda adalah AI, lalu arahkan mereka secara bijak untuk segera menghubungi profesional (Psikolog/Psikiater) atau hotline krisis kesehatan mental resmi.

[KONTEKS PERCAKAPAN SAAT INI]
- Pesan Pengguna: "${message}"
- Hasil analisis emosi dari model Machine Learning: "${detectedEmotion}"

Berikan respons empati Anda sekarang berdasarkan semua panduan di atas.
      `;

      const result = await model.generateContent(promptText);
      aiResponse = result.response.text().trim();
    } catch (geminiErr) {
      console.error("❌ Gagal mendapatkan respon Gemini API:", geminiErr.message);
      console.error("🔑 [DEBUG] GEMINI_API_KEY terdeteksi:", process.env.GEMINI_API_KEY ? `Ada (${process.env.GEMINI_API_KEY.substring(0, 8)}...)` : "TIDAK ADA / KOSONG!");
      console.error("📋 [DEBUG] Detail error:", geminiErr);
      // Fallback aman jika API key bermasalah atau jaringan down
      aiResponse = `Aku mendengarkanmu, dan aku bisa merasakan kalau kamu sedang berada di fase yang ${detectedEmotion.toLowerCase()}. Mau cerita lebih banyak tentang hal itu?`;
    }

    // --- TAHAP 3: LOGIKA PENYIMPANAN DATABASE ---
    let responseData;

    if (session_id !== 'guest') {
      const newChat = new ChatMessage({
        session_id,
        message,
        response: aiResponse,
        emotion: detectedEmotion
      });
      await newChat.save();
      responseData = newChat; 
    } else {
      responseData = {
        response: aiResponse,
        emotion: detectedEmotion
      };
      console.log("👻 [Mode Tamu] Pesan dibalas tanpa disimpan ke database.");
    }

    res.status(201).json({ message: 'Pesan terkirim', data: responseData });
  } catch (error) {
    console.error("Error di sendMessage:", error);
    res.status(500).json({ message: 'Gagal mengirim pesan', error });
  }
};

// 3. Fungsi Menarik Riwayat Chat dalam Satu Sesi
exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (sessionId === 'guest') {
      return res.status(200).json({ data: [] });
    }

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
    const sessions = await ChatSession.find({ user_id: userId }).sort({ isPinned: -1, createdAt: -1 });
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
    
    await ChatSession.findByIdAndDelete(sessionId);
    await ChatMessage.deleteMany({ session_id: sessionId }); 
    
    res.status(200).json({ message: 'Sesi dan riwayat obrolan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus sesi', error });
  }
};

// 7. Fungsi Menyematkan Sesi (Pin/Unpin)
exports.pinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { isPinned } = req.body;
    
    const updatedSession = await ChatSession.findByIdAndUpdate(
      sessionId, 
      { isPinned }, 
      { new: true }
    );
    res.status(200).json({ message: 'Status sematan berhasil diubah', session: updatedSession });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah status sematan', error });
  }
};