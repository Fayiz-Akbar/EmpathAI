/*
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      // Bypass DNS dengan menggunakan salah satu IP IPv4 server SMTP Gmail langsung.
      host: '142.251.10.108', 
      port: 587,
      secure: false, 
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `EmpathAI <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email berhasil dikirim ke:', options.email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
*/

const sendEmail = async (options) => {
  try {
    // ⚠️ TRIK BYPASS HUGGING FACE SMTP BLOCK (MOCK MODE)
    console.log('========= 📧 SIMULASI EMAIL OUTBOUND =========');
    console.log(`Pengirim : EmpathAI Sistem`);
    console.log(`Penerima : ${options.email}`);
    console.log(`Subjek   : ${options.subject}`);
    console.log(`Isi Pesan:\n${options.message}`);
    console.log('==============================================');

    // Kita langsung kembalikan status sukses tanpa menembak server Gmail asli
    // Ini mencegah 'Connection Timeout' dan membuat frontend langsung merespons cepat!
    return true; 
  } catch (error) {
    console.error('Error sending email simulation:', error);
    throw error;
  }
};

module.exports = sendEmail;