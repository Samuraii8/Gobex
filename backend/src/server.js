const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const prisma = require('./utils/prismaClient');

const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
// Sunucuyu başlat
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  // Environment Variable Kontrolü (Debug için)
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    console.log(`🔧 Database URL loaded: ${maskedUrl}`);
  } else {
    console.error('❌ FATAL: DATABASE_URL is not defined in environment variables!');
  }

  try {
    console.log('⏳ Attempting to connect to the database...');
    await prisma.$connect();
    console.log('✅ Database connection established successfully via Prisma.');
  } catch (error) {
    console.error('❌ CRITICAL DATABASE ERROR at Startup:');
    console.error(`   Message: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    // Not: process.exit yapmıyoruz, hata olsa bile API ayakta kalsın ki logları görebilelim.
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
