const dotenv = require('dotenv');
// .env dosyasını explicit olarak yükleyelim
dotenv.config();

const app = require('./app');
const prisma = require('./utils/prismaClient');

const PORT = process.env.PORT || 3001;

// Kritik Environment Variable Kontrolü
if (!process.env.DATABASE_URL) {
  console.error('FATAL ERROR: DATABASE_URL environment variable is MISSING in server.js!');
} else {
  // Güvenlik için şifreyi maskeleyerek loglayalım
  const safeUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
  console.log('Server starting with DATABASE_URL:', safeUrl);
}

// Sunucuyu başlat
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Veritabanı Bağlantı Testi
  try {
    await prisma.$connect();
    console.log('✅ Database connection has been established successfully via Prisma (MySQL).');

    // Basit bir sorgu ile testi derinleştirelim
    const userCount = await prisma.admin.count();
    console.log(`✅ Initial DB Check Passed: Found ${userCount} admins.`);

  } catch (error) {
    console.error('❌ CRITICAL DATABASE ERROR at Startup:', error);
    // process.exit(1); // Kaldırıldı: Sunucu ayakta kalsın ki logları okuyabilelim
  }
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

