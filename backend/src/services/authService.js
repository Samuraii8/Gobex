const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (ad, sifre) => {
  const admin = await prisma.admin.findUnique({ where: { ad: ad } });

  if (!admin) {
    throw new Error('Kullanıcı bulunamadı.');
  }

  const isMatch = await bcrypt.compare(sifre, admin.sifre);

  if (!isMatch) {
    throw new Error('Hatalı şifre.');
  }

  const token = jwt.sign(
    { id: admin.id, ad: admin.ad },
    process.env.JWT_SECRET,
    { expiresIn: '10m' }
  );

  return token;
};

module.exports = {
  login,
};
