const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (ad, sifre) => {
  const admin = await Admin.findOne({ where: { Ad: ad } });

  if (!admin) {
    throw new Error('Kullanıcı bulunamadı.');
  }

  const isMatch = await bcrypt.compare(sifre, admin.Şifre);

  if (!isMatch) {
    throw new Error('Hatalı şifre.');
  }

  const token = jwt.sign(
    { id: admin.İD, ad: admin.Ad },
    process.env.JWT_SECRET,
    { expiresIn: '12h' } // Token 12 saat geçerli
  );

  return token;
};

module.exports = {
  login,
};
