const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Kita gunakan format service 'gmail' lagi tapi dengan port 587 (TLS)
    // dan menghindari penggunaan 'secure: true' untuk mencegah blokir SSL Tunnel
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587, 
      secure: false, // Karena port 587, ini harus false
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      // Penting: Abaikan error TLS jika provider hosting memodifikasi sertifikat
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
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendEmail;
