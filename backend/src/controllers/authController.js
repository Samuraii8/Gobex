const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { ad, sifre } = req.body;
    
    if (!ad || !sifre) {
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    const token = await authService.login(ad, sifre);
    res.status(200).json({ token });
  } catch (error) {
    // Güvenlik: Detaylı hata mesajını gizle, sadece logla.
    console.error('Login Error:', error.message);
    
    // Kullanıcıya genel bir hata mesajı dön.
    // 401 Unauthorized her zaman "Kullanıcı adı veya şifre hatalı" demelidir.
    res.status(401).json({ message: 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.' });
  }
};

module.exports = {
  login,
};