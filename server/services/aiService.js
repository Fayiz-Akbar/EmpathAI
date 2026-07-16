const axios = require('axios');

/**
 * Memanggil server Python (FastAPI) untuk mendeteksi emosi dari teks.
 * @param {string} text - Pesan pengguna yang akan dianalisis emosinya.
 * @returns {string} - Label emosi yang terdeteksi (misal: 'sedih', 'senang', 'marah', 'stres', 'netral').
 */
const detectEmotion = async (text) => {
  try {
    const aiServerUrl = process.env.PYTHON_AI_URL || 'http://127.0.0.1:7860';
    const response = await axios.post(`${aiServerUrl}/predict`, { text });
    return response.data.emotion;
  } catch (error) {
    console.error('❌ [aiService] Gagal menghubungi Python AI Server:', error.message);
    return 'netral'; // Default fallback jika Python server down
  }
};

module.exports = { detectEmotion };