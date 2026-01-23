const request = require('supertest');
const app = require('../app');
const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Hizmetler API', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.admin.deleteMany({ where: { ad: 'testadmin_hizmetler' } });
    await prisma.admin.create({
      data: {
        ad: 'testadmin_hizmetler',
        sifre: hashedPassword
      }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_hizmetler', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { ad: 'testadmin_hizmetler' } });
    if (createdId) await prisma.hizmetler.deleteMany({ where: { id: createdId } });
    await prisma.$disconnect();
  });

  it('POST /api/hizmetler - should create service', async () => {
    const res = await request(app)
      .post('/api/hizmetler')
      .set('Authorization', `Bearer ${token}`)
      .field('hizmetAdi', 'Test Hizmet')
      .field('hizmetAciklamasi', 'Açıklama')
      .field('hizmetKategorisi', 'Kategori');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /api/hizmetler - should return list', async () => {
    const res = await request(app).get('/api/hizmetler');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('DELETE /api/hizmetler/:id - should delete service', async () => {
    const res = await request(app)
      .delete(`/api/hizmetler/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });
});
