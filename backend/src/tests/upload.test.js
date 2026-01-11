const request = require('supertest');
const app = require('../app');
const { Admin } = require('../models');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

let token;
const testImagePath = path.join(__dirname, 'test-image.jpg');

describe('Upload API Tests', () => {

    beforeAll(async () => {
        // Test admin oluştur
        await Admin.destroy({ where: { Ad: 'testadmin_upload' } });
        const hashedPassword = await bcrypt.hash('testpassword123', 10);
        await Admin.create({ Ad: 'testadmin_upload', Şifre: hashedPassword });

        // Login ve token al
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ ad: 'testadmin_upload', sifre: 'testpassword123' });
        token = loginRes.body.token;

        // Geçici test resmi oluştur
        fs.writeFileSync(testImagePath, 'fake image content');
    });

    afterAll(async () => {
        // Temizlik
        await Admin.destroy({ where: { Ad: 'testadmin_upload' } });
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
    });

    // POST - Resim yükle (Başarılı)
    it('POST /api/upload - should upload image successfully', async () => {
        const res = await request(app)
            .post('/api/upload')
            .set('Authorization', `Bearer ${token}`)
            // 'image' field ismini kullanıyoruz
            .attach('image', testImagePath);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Resim başarıyla yüklendi.');
        expect(res.body).toHaveProperty('url');
        expect(res.body.url).toMatch(/^\/images\//);

        // Yüklenen dosyayı temizle
        const uploadedFilename = res.body.filename;
        const uploadedFilePath = path.join(__dirname, '../../public/images', uploadedFilename);
        if (fs.existsSync(uploadedFilePath)) {
            fs.unlinkSync(uploadedFilePath);
        }
    });

    // POST - Token olmadan yükle
    it('POST /api/upload - should fail without token', async () => {
        const res = await request(app)
            .post('/api/upload')
            .attach('image', testImagePath);

        expect(res.statusCode).toEqual(403);
    });

    // POST - Dosya seçilmedi
    it('POST /api/upload - should fail if no file selected', async () => {
        const res = await request(app)
            .post('/api/upload')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Lütfen bir resim dosyası seçin.');
    });
});
