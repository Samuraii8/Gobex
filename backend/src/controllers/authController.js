const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { ad, sifre } = req.body;

    // Request bilgilerini loglayalım (Şifreyi gizleyerek)
    console.log('📝 Login Request Received:', {
      ad: ad,
      sifre: sifre ? '********' : 'MISSING',
      ip: req.ip
    });

    if (!ad || !sifre) {
      console.warn('⚠️ Login Failed: Missing credentials');
      return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
    }

    const token = await authService.login(ad, sifre);

    console.log(`✅ Login Successful for user: ${ad}`);
    res.status(200).json({ token });

  } catch (error) {
    // Hatanın detayını sunucu loglarına basalım
    console.error('❌ LOGIN CONTROLLER ERROR:');
    console.error(`   User: ${req.body.ad}`);
    console.error(`   Message: ${error.message}`);
    // console.error(`   Stack: ${error.stack}`); // İsteğe bağlı, çok kalabalık olursa kapatılabilir

    // Detaylı hata mesajını client'a dönmek güvenlik riski olabilir, 
    // ama 401 Unauthorized genellikle güvenlidir.
    res.status(401).json({ message: 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.' });
  }
};

module.exports = {
  login,
};