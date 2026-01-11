const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Güvenlik Middleware'leri
app.use(helmet()); // HTTP başlıklarını güvenli hale getirir
app.use(cors()); // CORS politikaları (Geliştirme için açık, canlıda domain belirtilmeli)

// Body Parser Limit (DoS koruması için)
app.use(express.json({ limit: '10kb' }));

// Global Rate Limiter (Tüm istekler için)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada 100 istek
  message: 'Çok fazla istek gönderdiniz, lütfen 15 dakika sonra tekrar deneyin.'
});
app.use('/api', globalLimiter);

// Auth Rate Limiter (Brute-force koruması için özel sınır)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 10, // 15 dakikada en fazla 10 başarısız giriş denemesi
  message: 'Çok fazla giriş denemesi yaptınız, lütfen 15 dakika sonra tekrar deneyin.'
});

// Statik Dosyalar (Güvenli başlıklarla servis edilir - Helmet sayesinde)
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Rotalar
const authRoutes = require('./routes/authRoutes');
// Login rotasına özel rate limiter uyguluyoruz
app.use('/api/auth', authLimiter, authRoutes);

const anaSayfaRoutes = require('./routes/anaSayfaRoutes');
app.use('/api/anasayfa', anaSayfaRoutes);

const galeriRoutes = require('./routes/galeriRoutes');
app.use('/api/galeri', galeriRoutes);

const hizmetlerRoutes = require('./routes/hizmetlerRoutes');
app.use('/api/hizmetler', hizmetlerRoutes);

const sliderRoutes = require('./routes/sliderRoutes');
app.use('/api/slider', sliderRoutes);

const iletisimRoutes = require('./routes/iletisimRoutes');
app.use('/api/iletisim', iletisimRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);


// Simple route for health check
app.get('/', (req, res) => {
  res.send('Gobex Backend is running securely!');
});

module.exports = app;
