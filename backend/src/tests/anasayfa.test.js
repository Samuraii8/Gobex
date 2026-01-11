const request = require('supertest');
const app = require('../app');
const { AnaSayfa, Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('AnaSayfa API', () => {
  beforeAll(async () => {
    // Admin girişi yap ve token al
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Admin.destroy({ where: { ad: 'testadmin_anasayfa' } });
    await Admin.create({
      ad: 'testadmin_anasayfa',
      sifre: hashedPassword
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_anasayfa', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await Admin.destroy({ where: { ad: 'testadmin_anasayfa' } });
    if (createdId) await AnaSayfa.destroy({ where: { id: createdId } });
    await sequelize.close();
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
      .field('baslik', 'Güncellenmiş Başlık');

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
