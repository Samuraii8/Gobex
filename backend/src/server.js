const app = require('./app');
const prisma = require('./utils/prismaClient');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await prisma.$connect();
    console.log('Database connection has been established successfully via Prisma (MySQL).');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
});
