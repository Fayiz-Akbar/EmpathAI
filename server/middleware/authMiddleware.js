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
    
    // 3. Verifikasi token menggunakan kunci rahasia dari .env
    // Pastikan di file .env kamu ada variabel JWT_SECRET
    const secretKey = process.env.JWT_SECRET || 'RAHASIA_NEGARA';
    
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    
    next();
  } catch (error) {
    console.error("JWT Error:", error.message); // Tambahan log agar kalau error lagi kelihatan alasannya di terminal Node
    res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa!' });
  }
};