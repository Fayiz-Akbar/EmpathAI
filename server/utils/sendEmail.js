const axios = require('axios');

const sendEmail = async (options) => {
  try {
    const data = {
      sender: { 
        name: "EmpathAI Sistem", 
        email: "dhnahmad32@gmail.com" // Email resmi kelompokmu
      },
      to: [
        { email: options.email }
      ],
      subject: options.subject,
      textContent: options.message
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Membaca dari Secret Hugging Face
        'content-type': 'application/json'
      }
    });

    console.log('✅ Email asli berhasil dikirim lewat Brevo! ID:', response.data.messageId);
  } catch (error) {
    if (error.response) {
      console.error('❌ Eror HTTP API Brevo:', error.response.data);
    } else {
      console.error('❌ Gagal mengirim email:', error.message);
    }
    throw error;
  }
};

module.exports = sendEmail;