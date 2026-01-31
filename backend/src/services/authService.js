const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (ad, sifre) => {
  try {
    console.log(`Login attempt for user: ${ad}`);
    // Veritabanı bağlantı kontrolü (Debugging)
    console.log('Checking database connection before findUnique...');

    // Explicit olarak veritabanına erişim
    const admin = await prisma.admin.findUnique({ where: { ad: ad } });

    console.log('Database query finished. Admin found:', !!admin);

    if (!admin) {
      console.warn(`Login failed: User '${ad}' not found.`);
      throw new Error('Kullanıcı bulunamadı.');
    }

    const isMatch = await bcrypt.compare(sifre, admin.sifre);

    if (!isMatch) {
      console.warn(`Login failed: Invalid password for user '${ad}'.`);
      throw new Error('Hatalı şifre.');
    }

    const token = jwt.sign(
      { id: admin.id, ad: admin.ad },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    console.log(`Login successful for user: ${ad}`);
    return token;

  } catch (error) {
    console.error('❌ LOGIN SERVICE ERROR:', error);
    throw error; // Hatayı controller'a fırlat
  }
};

module.exports = {
  login,
};
