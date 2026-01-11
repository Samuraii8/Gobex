const request = require('supertest');
const app = require('../app');
const { Slider, Admin, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Slider API', () => {
    beforeAll(async () => {
        // Create a test admin for authentication
        const hashedPassword = await bcrypt.hash('123456', 10);
        await Admin.destroy({ where: { ad: 'testadmin_slider' } });
        await Admin.create({
            ad: 'testadmin_slider',
            sifre: hashedPassword
        });

        // Login to get token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ ad: 'testadmin_slider', sifre: '123456' });
        token = loginRes.body.token;
    });

    afterAll(async () => {
        // Clean up
        await Admin.destroy({ where: { ad: 'testadmin_slider' } });
        if (createdId) await Slider.destroy({ where: { id: createdId } });
        await sequelize.close();
    });

    it('POST /api/slider - should create slider item', async () => {
        const res = await request(app)
            .post('/api/slider')
            .set('Authorization', `Bearer ${token}`)
            .field('sliderAd', 'Test Slider');
        // Resim yükleme testi için .attach('resim', 'path/to/file') gerekebilir ama şimdilik sadece text

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.sliderAd).toEqual('Test Slider');
        createdId = res.body.id;
    });

    it('GET /api/slider - should return list', async () => {
        const res = await request(app).get('/api/slider');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        const found = res.body.find(item => item.id === createdId);
        expect(found).toBeTruthy();
    });

    it('GET /api/slider/:id - should return single item', async () => {
        const res = await request(app).get(`/api/slider/${createdId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toEqual(createdId);
        expect(res.body.sliderAd).toEqual('Test Slider');
    });

    it('PUT /api/slider/:id - should update slider item', async () => {
        const res = await request(app)
            .put(`/api/slider/${createdId}`)
            .set('Authorization', `Bearer ${token}`)
            .field('sliderAd', 'Updated Slider');

        expect(res.statusCode).toEqual(200);
        expect(res.body.sliderAd).toEqual('Updated Slider');
    });

    it('DELETE /api/slider/:id - should delete slider item', async () => {
        const res = await request(app)
            .delete(`/api/slider/${createdId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(204);
    });

    it('GET /api/slider/:id - should return 404 for deleted item', async () => {
        const res = await request(app).get(`/api/slider/${createdId}`);
        expect(res.statusCode).toEqual(404);
    });
});
