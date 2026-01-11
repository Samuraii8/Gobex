const request = require('supertest');
const app = require('../app');
const { sequelize, Iletisim, Admin } = require('../models');
const bcrypt = require('bcryptjs');

let token;
let testMessageId;

describe('İletişim API Tests', () => {

    beforeAll(async () => {
        // Test admin oluştur
        await Admin.destroy({ where: { ad: 'testadmin_iletisim' } });
        const hashedPassword = await bcrypt.hash('testpassword123', 10);
        await Admin.create({ ad: 'testadmin_iletisim', sifre: hashedPassword });

        // Login ve token al
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ ad: 'testadmin_iletisim', sifre: 'testpassword123' });
        token = loginRes.body.token;
    });

    afterAll(async () => {
        // Temizlik
        await Admin.destroy({ where: { ad: 'testadmin_iletisim' } });
        if (testMessageId) {
            await Iletisim.destroy({ where: { id: testMessageId } });
        }
        await sequelize.close();
    });

    // POST - İletişim mesajı gönderme (Public)
    it('POST /api/iletisim - should create a new message', async () => {
        const res = await request(app)
            .post('/api/iletisim')
            .send({
                adSoyad: 'Test Kullanıcı',
                ePosta: 'test@example.com',
                konu: 'Test Konusu',
                mesaj: 'Bu bir test mesajıdır. En az 10 karakter olmalı.'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Mesajınız başarıyla gönderildi.');
        expect(res.body).toHaveProperty('id');
        testMessageId = res.body.id;
    });

    // POST - Eksik alan ile mesaj gönderme
    it('POST /api/iletisim - should fail with missing fields', async () => {
        const res = await request(app)
            .post('/api/iletisim')
            .send({
                adSoyad: 'Test Kullanıcı'
                // ePosta, konu, mesaj eksik
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Tüm alanlar zorunludur.');
    });

    // POST - Geçersiz e-posta
    it('POST /api/iletisim - should fail with invalid email', async () => {
        const res = await request(app)
            .post('/api/iletisim')
            .send({
                adSoyad: 'Test Kullanıcı',
                ePosta: 'gecersiz-email',
                konu: 'Test Konusu',
                mesaj: 'Bu bir test mesajıdır.'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Geçerli bir e-posta adresi giriniz.');
    });

    // GET - Tüm mesajları listele (Admin)
    it('GET /api/iletisim - should return all messages with token', async () => {
        const res = await request(app)
            .get('/api/iletisim')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // GET - Token olmadan mesajları listeleme
    it('GET /api/iletisim - should fail without token', async () => {
        const res = await request(app)
            .get('/api/iletisim');

        expect(res.statusCode).toEqual(403);
    });

    // GET - Tek mesaj getir (Admin)
    it('GET /api/iletisim/:id - should return single message', async () => {
        const res = await request(app)
            .get(`/api/iletisim/${testMessageId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('adSoyad', 'Test Kullanıcı');
    });

    // DELETE - Mesaj sil (Admin)
    it('DELETE /api/iletisim/:id - should delete message with token', async () => {
        const res = await request(app)
            .delete(`/api/iletisim/${testMessageId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(204);
        testMessageId = null; // Silindi, temizleme gerekmez
    });
});
