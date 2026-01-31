const dotenv = require('dotenv');
// .env dosyasını explicit olarak yükleyelim
dotenv.config();

const app = require('./app');
const prisma = require('./utils/prismaClient');

const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
const server = app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await prisma.$connect();
    console.log('Database connection has been established successfully via Prisma (MySQL).');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Hata durumunda process.exit yapmıyoruz, sunucu çalışmaya devam etsin
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
