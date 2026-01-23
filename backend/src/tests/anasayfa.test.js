const request = require('supertest');
const app = require('../app');
const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('AnaSayfa API', () => {
  beforeAll(async () => {
    // Admin girişi yap ve token al
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.admin.deleteMany({ where: { ad: 'testadmin_anasayfa' } });
    await prisma.admin.create({
      data: {
        ad: 'testadmin_anasayfa',
        sifre: hashedPassword
      }
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_anasayfa', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({ where: { ad: 'testadmin_anasayfa' } });
    if (createdId) await prisma.anaSayfa.deleteMany({ where: { id: createdId } });
    await prisma.$disconnect();
  });

  it('GET /api/anasayfa - should return all data', async () => {
    const res = await request(app).get('/api/anasayfa');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('POST /api/anasayfa - should create data with token', async () => {
    const res = await request(app)
      .post('/api/anasayfa')
      .set('Authorization', `Bearer ${token}`)
      .field('baslik', 'Test Başlık')
      .field('icerik', 'Test İçerik');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('PUT /api/anasayfa/:id - should update data with token', async () => {
    const res = await request(app)
      .put(`/api/anasayfa/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .field('baslik', 'Güncellenmiş Başlık')
      .field('icerik', 'Güncellenmiş İçerik Testi');

    expect(res.statusCode).toEqual(200);
    expect(res.body.baslik).toEqual('Güncellenmiş Başlık');
  });

  it('DELETE /api/anasayfa/:id - should delete data with token', async () => {
    const res = await request(app)
      .delete(`/api/anasayfa/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });
});
