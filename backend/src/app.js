const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


const app = express();

// Rate limiting için proxy'lere (Nginx, Cloudflare vb.) güven
app.set('trust proxy', 1);


// Güvenlik Middleware'leri
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // 'unsafe-inline' kaldırıldı, sadece güvenli kaynaklar eklendi
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // https: yerine spesifik domain
      imgSrc: ["'self'", "data:"],
      frameAncestors: ["'none'"], // Hiçbir sitenin iframe içinde bu API'yi yüklemesine izin verme
      formAction: ["'self'"], // Formların sadece kendine gönderilmesine izin ver
    },
  },
})); // HTTP başlıklarını güvenli hale getirir
// CORS ayarları (Frontend ve Backend farklı domainlerde olduğu için gerekli)
const allowedOrigins = [
  'https://gobex.com.tr',
  'https://www.gobex.com.tr'  // Local Vite development
];

app.use(cors({
  origin: function (origin, callback) {
    // !origin: Postman gibi araçlar veya sunucu-sunucu istekleri için izin ver
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true
}));

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


// Simple route for health check
app.get('/api/health', (req, res) => {
  res.send('Gobex Backend is running securely!');
});

// Global Error Handler (En sona eklenmeli)
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

module.exports = app;

