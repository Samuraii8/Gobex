const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const prisma = require('./utils/prismaClient');

const PORT = process.env.PORT || 3001;

// Sunucuyu başlat
// Sunucuyu başlat
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Environment Variable Kontrolü
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@');
    console.log(`🔧 Database Config Loaded: ${maskedUrl}`);
  } else {
    console.error('❌ FATAL: DATABASE_URL is missing!');
  }

  try {
    console.log('⏳ Connecting to Database...');
    await prisma.$connect();
    console.log('✅ Database connection established via Prisma.');

    // Bağlantıyı test etmek için gerçek bir sorgu atalım
    console.log('🧪 Testing DB Query...');
    const count = await prisma.admin.count();
    console.log(`✅ DB Query Successful! Found ${count} admin(s).`);

  } catch (error) {
    console.error('❌ CRITICAL DATABASE ERROR:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);
    // console.error(`   Stack: ${error.stack}`);
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
