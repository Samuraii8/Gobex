const request = require('supertest');
const app = require('../app');
const { Hizmetler, Admin } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Hizmetler API', () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await Admin.destroy({ where: { Ad: 'testadmin_hizmetler' } });
    await Admin.create({
      Ad: 'testadmin_hizmetler',
      Şifre: hashedPassword
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ ad: 'testadmin_hizmetler', sifre: '123456' });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await Admin.destroy({ where: { Ad: 'testadmin_hizmetler' } });
    if(createdId) await Hizmetler.destroy({ where: { İD: createdId } });
  });

  it('POST /api/hizmetler - should create service', async () => {
    const res = await request(app)
      .post('/api/hizmetler')
      .set('Authorization', `Bearer ${token}`)
      .send({
        Hizmet_adı: 'Test Hizmet',
        Hizmet_açıklaması: 'Açıklama',
        Hizmet_Kategorisi: 'Kategori',
        Hizmet_resim: 'hizmet.jpg'
      });
    expect(res.statusCode).toEqual(201);
    createdId = res.body.İD;
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
