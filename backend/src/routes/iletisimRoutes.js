const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const iletisimController = require('../controllers/iletisimController');
const authMiddleware = require('../middleware/authMiddleware');

// İletişim formu için özel sert rate limiter (spam koruması)
const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 5, // 1 saatte en fazla 5 mesaj
    message: {
        message: 'Çok fazla mesaj gönderdiniz. Lütfen 1 saat sonra tekrar deneyin.',
        retryAfter: '1 saat'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// ===== PUBLIC ROUTES (Rate Limited) =====

// POST - İletişim formu gönderimi (Sert rate limit)
router.post('/', contactFormLimiter, iletisimController.createIletisim);

// ===== ADMIN ROUTES (JWT Protected) =====

// GET - Tüm mesajları listele
router.get('/', authMiddleware, iletisimController.getAllIletisim);

// GET - Tek mesaj getir
router.get('/:id', authMiddleware, iletisimController.getIletisimById);

// DELETE - Tek mesaj sil
router.delete('/:id', authMiddleware, iletisimController.deleteIletisim);

// DELETE - Toplu silme
router.delete('/', authMiddleware, iletisimController.deleteMultipleIletisim);

module.exports = router;
