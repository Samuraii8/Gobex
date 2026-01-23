const request = require('supertest');
const app = require('../app');
const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');

describe('Auth API', () => {
  beforeAll(async () => {
    // Test kullanıcısını oluştur (Eğer yoksa)
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.admin.deleteMany({ where: { ad: 'testadmin' } }); // Temizlik
    await prisma.admin.create({
      data: {
        ad: 'testadmin',
        sifre: hashedPassword
      }
    });
  });

  afterAll(async () => {
    // Temizlik
    await prisma.admin.deleteMany({ where: { ad: 'testadmin' } });
    await prisma.$disconnect();
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        ad: 'testadmin',
        sifre: '123456'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        ad: 'testadmin',
        sifre: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});
