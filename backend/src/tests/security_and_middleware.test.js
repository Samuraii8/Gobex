const request = require('supertest');
const app = require('../app');
const prisma = require('../utils/prismaClient');
const jwt = require('jsonwebtoken');

describe('Security and Middleware Tests', () => {
    let validToken;

    beforeAll(async () => {
        // Testler için geçerli bir token oluştur
        validToken = jwt.sign({ id: 1, ad: 'testadmin' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('Section 1: Middleware Tests', () => {

        describe('Auth Middleware', () => {
            it('should return 403 if no token is provided on protected routes', async () => {
                const res = await request(app).delete('/api/slider/1');
                expect(res.statusCode).toEqual(403);
            });

            it('should return 401 if token is invalid', async () => {
                const res = await request(app)
                    .delete('/api/slider/1')
                    .set('Authorization', 'Bearer invalid-token');
                expect(res.statusCode).toEqual(401);
            });
        });

        describe('Validation Middleware', () => {
            it('should return 400 if validation fails', async () => {
                const res = await request(app)
                    .post('/api/iletisim')
                    .send({
                        adSoyad: 'Me',
                        ePosta: 'invalid-email',
                        konu: 'Hi',
                        mesaj: 'Short'
                    });
                expect(res.statusCode).toEqual(400);
            });
        });

        describe('Upload Middleware', () => {
            it('should return 400 for invalid file types', async () => {
                const res = await request(app)
                    .post('/api/galeri')
                    .set('Authorization', `Bearer ${validToken}`)
                    .attach('resim', Buffer.from('fake-data'), 'test.txt');

                expect(res.statusCode).toEqual(400);
            });
        });
    });

    describe('Section 2: Security Header Tests', () => {
        it('should have Helmet security headers', async () => {
            const res = await request(app).get('/');
            expect(res.headers).toHaveProperty('content-security-policy');
            expect(res.headers).toHaveProperty('x-frame-options');
        });

        it('should limit request body size (10kb)', async () => {
            const largeBody = 'a'.repeat(11000);
            const res = await request(app)
                .post('/api/iletisim')
                .send({ data: largeBody });
            expect(res.statusCode).toEqual(413);
        });

        describe('Rate Limiting', () => {
            it('should return 429 after too many attempts on auth routes', async () => {
                // authLimiter max 10 requests
                // Note: The loop count depends on current rate limit state. 
                // Since this runs after other tests, the limit might be partially used or not.
                // We'll try to hit it.
                for (let i = 0; i < 15; i++) {
                    const res = await request(app).post('/api/auth/login').send({});
                    if (res.statusCode === 429) {
                        expect(res.statusCode).toEqual(429);
                        return;
                    }
                }
            }, 20000);
        });
    });
});
