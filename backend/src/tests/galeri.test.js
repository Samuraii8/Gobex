const request = require('supertest');
const app = require('../app');
const { Galeri, Admin } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Galeri API', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Admin.destroy({ where: { Ad: 'testadmin_galeri' } });
    await Admin.create({
      Ad: 'testadmin_galeri',
      Şifre: hashedPassword
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_galeri', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await Admin.destroy({ where: { Ad: 'testadmin_galeri' } });
    if(createdId) await Galeri.destroy({ where: { İD: createdId } });
  });

  it('POST /api/galeri - should create gallery item', async () => {
    const res = await request(app)
      .post('/api/galeri')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Galeri_başlık: 'Test Galeri',
        Galeri_resim: 'galeri.jpg',
        Galeri_açıklaması: 'Açıklama'
      });
    expect(res.statusCode).toEqual(201);
    createdId = res.body.İD;
  });

  it('GET /api/galeri - should return list', async () => {
    const res = await request(app).get('/api/galeri');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/galeri/:id - should return single item', async () => {
    const res = await request(app).get(`/api/galeri/${createdId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.İD).toEqual(createdId);
  });

  it('DELETE /api/galeri/:id - should delete item', async () => {
    const res = await request(app)
      .delete(`/api/galeri/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });
});
