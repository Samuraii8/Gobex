const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (ad, sifre) => {
  console.log(`🔍 AuthService: Searching for user '${ad}'...`);
  const admin = await prisma.admin.findUnique({ where: { ad: ad } });

  if (!admin) {
    console.warn(`⚠️ AuthService: User '${ad}' NOT found in database.`);
    throw new Error('Kullanıcı bulunamadı.');
  }

  // Debug: Hash formatını kontrol etmek için loglayalım (Tamamını değil!)
  const hashPrefix = admin.sifre.substring(0, 7); // Örn: $2a$10$
  console.log(`👤 AuthService: User found. Stored Hash Prefix: '${hashPrefix}...'`);

  console.log('🔐 AuthService: Verifying password...');
  const isMatch = await bcrypt.compare(sifre, admin.sifre);

  if (!isMatch) {
    console.warn(`❌ AuthService: Password mismatch for user '${ad}'.`);
    throw new Error('Hatalı şifre.');
  }

  console.log(`✅ AuthService: Credentials verified for '${ad}'. Generating token...`);
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
