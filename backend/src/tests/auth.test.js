const request = require('supertest');
const app = require('../app');
const { Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

describe('Auth API', () => {
  beforeAll(async () => {
    // Test kullanıcısını oluştur (Eğer yoksa)
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Admin.destroy({ where: { ad: 'testadmin' } }); // Temizlik
    await Admin.create({
      ad: 'testadmin',
      sifre: hashedPassword
    });
  });

  afterAll(async () => {
    // Temizlik
    await Admin.destroy({ where: { ad: 'testadmin' } });
    await sequelize.close();
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
