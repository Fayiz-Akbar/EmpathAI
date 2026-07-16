const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Fungsi Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};

// Fungsi Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
      return res.status(403).json({ 
        message: `Akun terkunci sementara, coba lagi dalam ${remainingSeconds} detik.`,
        isLocked: true
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 60 * 1000; // Kunci selama 1 menit (60000ms)
      }
      
      await user.save();
      return res.status(400).json({ message: 'Password salah!' });
    }

    // Jika password benar dan akun tidak terkunci, reset status lockout
    if (user.loginAttempts > 0 || user.lockUntil) {
      user.loginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET || 'RAHASIA_NEGARA', 
        { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil!',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};

// Fungsi Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Dari authMiddleware (JWT decoded)

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter.' });
    }

    // Cari user di database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    // Verifikasi password lama
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini salah.' });
    }

    // Hash password baru dan simpan
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password berhasil diubah!' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.', error });
  }
};

// Fungsi Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Pencegahan enumerasi email: selalu kirim status 200 dengan pesan generik meski user tidak ada
      return res.status(200).json({ message: 'Jika email Anda terdaftar di sistem kami, tautan pemulihan telah dikirim ke kotak masuk Anda.' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token untuk disimpan di database
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 menit

    await user.save();

    // Buat URL reset password. Halaman frontend untuk reset password
    const clientUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    const message = `Anda menerima email ini karena Anda (atau orang lain) telah meminta pengaturan ulang password akun Anda.\n\nSilakan klik tautan berikut, atau tempel di browser Anda untuk menyelesaikan proses:\n\n${resetUrl}\n\nJika Anda tidak memintanya, abaikan email ini dan password Anda tidak akan berubah. Tautan ini akan kedaluwarsa dalam 15 menit.\n`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Permintaan Reset Password EmpathAI',
        message
      });

      // Pesan yang sama persis seperti ketika user tidak ditemukan (pencegahan enumerasi)
      res.status(200).json({ message: 'Jika email Anda terdaftar di sistem kami, tautan pemulihan telah dikirim ke kotak masuk Anda.' });
    } catch (emailError) {
      // Jika gagal kirim email, bersihkan field reset
      console.error('❌ Gagal Mengirim Email lewat Nodemailer:', emailError.message); // <-- Tambahkan log ini
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({ message: 'Gagal mengirim email. Pastikan konfigurasi SMTP benar.' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.', error });
  }
};

// Fungsi Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token dan password baru wajib diisi.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password baru minimal 6 karakter.' });
    }

    // Hash token yang diterima dari parameter/body
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    // Set password baru
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Hapus field reset password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password berhasil diatur ulang.' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server.', error });
  }
};