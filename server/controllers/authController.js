const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Fungsi Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    // Hash Password biar aman
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan User Baru
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

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }

    // Cek kecocokan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password salah!' });
    }

    const token = jwt.sign({ id: user._id }, 'RAHASIA_NEGARA', { expiresIn: '1d' });

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