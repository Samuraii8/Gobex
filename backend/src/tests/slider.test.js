const request = require('supertest');
const app = require('../app');
const { Slider, Admin } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let createdId;

describe('Slider API', () => {
    beforeAll(async () => {
        // Create a test admin for authentication
        const hashedPassword = await bcrypt.hash('123456', 10);
        await Admin.destroy({ where: { Ad: 'testadmin_slider' } });
        await Admin.create({
            Ad: 'testadmin_slider',
            Şifre: hashedPassword
        });

        // Login to get token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ ad: 'testadmin_slider', sifre: '123456' });
        token = loginRes.body.token;
    });

    afterAll(async () => {
        // Clean up
        await Admin.destroy({ where: { Ad: 'testadmin_slider' } });
        if (createdId) await Slider.destroy({ where: { İD: createdId } });
    });

    it('POST /api/slider - should create slider item', async () => {
        const res = await request(app)
            .post('/api/slider')
            .set('Authorization', `Bearer ${token}`)
            .send({
                Slider_ad: 'Test Slider',
                Slider_resim: 'slider.jpg'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('İD');
        expect(res.body.Slider_ad).toEqual('Test Slider');
        createdId = res.body.İD;
    });

    it('GET /api/slider - should return list', async () => {
        const res = await request(app).get('/api/slider');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        // Check if the created item is in the list
        const found = res.body.find(item => item.İD === createdId);
        expect(found).toBeTruthy();
    });

    it('GET /api/slider/:id - should return single item', async () => {
        const res = await request(app).get(`/api/slider/${createdId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.İD).toEqual(createdId);
        expect(res.body.Slider_ad).toEqual('Test Slider');
    });

    it('PUT /api/slider/:id - should update slider item', async () => {
        const res = await request(app)
            .put(`/api/slider/${createdId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                Slider_ad: 'Updated Slider',
                Slider_resim: 'updated_slider.jpg'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.Slider_ad).toEqual('Updated Slider');
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
