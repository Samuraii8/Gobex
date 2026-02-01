const prisma = require('../utils/prismaClient');
const jwt = require('jsonwebtoken');
const login = async (ad, sifre) => {
  console.log(`🔍 AuthService: Searching for user '${ad}'...`);
  const admin = await prisma.admin.findUnique({ where: { ad: ad } });

  if (!admin) {
    console.warn(`⚠️ AuthService: User '${ad}' NOT found in database.`);
    throw new Error('Kullanıcı bulunamadı.');
  }

  // Debug: ŞİFRE KARŞILAŞTIRMA (PLAIN TEXT)
  console.log('🔐 AuthService: Comparing plain text passwords...');
  console.log(`   Input Password: '${sifre}'`);
  console.log(`   DB Password:    '${admin.sifre}'`);

  // DİKKAT: Güvenliksiz Karşılaştırma (İstek üzerine)
  const isMatch = (sifre === admin.sifre);

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
