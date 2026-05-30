const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Menggunakan jalur aman SSL
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      // Tambahkan instruksi ini untuk menghindari IPv6 Error: `ENETUNREACH`
      // family: 4 akan memaksa penggunaan IPv4
      family: 4,
      
      // Tambahkan opsi TLS untuk mem-bypass beberapa blokir IP lokal server
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
