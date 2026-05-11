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
      user: { id: user._id, name: user.name, email: user.email, theme: user.theme || 'light' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};

// Fungsi Update Theme
exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.id;

    if (!['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({ message: 'Tema tidak valid!' });
    }

    const user = await User.findByIdAndUpdate(userId, { theme }, { new: true });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan!' });

    res.status(200).json({ message: 'Tema berhasil diperbarui!', theme: user.theme });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};