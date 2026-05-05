const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Ambil token dari header request
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak! Anda harus login terlebih dahulu.' });
  }

  try {
    // 2. Bersihkan kata "Bearer " dari token
    const token = authHeader.replace('Bearer ', '');
    
    // 3. Verifikasi token menggunakan kata sandi rahasia yang sama saat login
    const verified = jwt.verify(token, 'RAHASIA_NEGARA');
    req.user = verified;
    
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa!' });
  }
};