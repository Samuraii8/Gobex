const request = require('supertest');
const app = require('../app');
const { Galeri, Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Galeri API', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Admin.destroy({ where: { ad: 'testadmin_galeri' } });
    await Admin.create({
      ad: 'testadmin_galeri',
      sifre: hashedPassword
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_galeri', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await Admin.destroy({ where: { ad: 'testadmin_galeri' } });
    if (createdId) await Galeri.destroy({ where: { id: createdId } });
    await sequelize.close();
  });

  it('POST /api/galeri - should create gallery item', async () => {
    const res = await request(app)
      .post('/api/galeri')
      .set('Authorization', `Bearer ${token}`)
      .field('galeriBaslik', 'Test Galeri')
      .field('galeriAciklamasi', 'Açıklama');

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /api/galeri - should return list', async () => {
    const res = await request(app).get('/api/galeri');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/galeri/:id - should return single item', async () => {
    const res = await request(app).get(`/api/galeri/${createdId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(createdId);
  });

  it('DELETE /api/galeri/:id - should delete item', async () => {
    const res = await request(app)
      .delete(`/api/galeri/${createdId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(204);
  });
});
