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
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  login,
};
