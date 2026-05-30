const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      // 🛑 HAPUS 'service: gmail' agar properti host dan family di bawah tidak ditimpa
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false, // Karena port 587, ini harus false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      family: 4 // 🔥 INI KUNCINYA: Memaksa Nodemailer menggunakan IPv4 (Bypass error ENETUNREACH IPv6)
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