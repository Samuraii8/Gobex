# Gobex Backend

Bu proje, Gobex uygulamasının backend kısmıdır. Node.js, Express.js ve PostgreSQL kullanarak geliştirilmiştir.

## 🚀 Özellikler

- **Express.js**: Web framework olarak kullanılır
- **Sequelize ORM**: PostgreSQL ile veritabanı işlemleri
- **RESTful API**: Ana sayfa verileri için API endpoint'leri
- **Environment Variables**: Güvenli yapılandırma yönetimi
- **MVC Architecture**: Model-View-Controller mimarisi

## 📋 Gereksinimler

Projenin çalışması için aşağıdaki yazılımların sisteminizde yüklü olması gerekir:

- **Node.js** (v14 veya üzeri)
- **PostgreSQL** (v12 veya üzeri)
- **npm** veya **yarn**

### Gereksinim Kontrolü

```bash
# Node.js versiyonu kontrolü
node --version

# npm versiyonu kontrolü
npm --version

# PostgreSQL bağlantısı kontrolü
psql --version
```

## 🛠️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd gobex/backend
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables Kurulumu

Proje kök dizininde (backend klasörü içinde) `.env` dosyası oluşturun:

```bash
touch .env
```

`.env` dosyasının içine aşağıdaki değişkenleri ekleyin:

```env
# Veritabanı Ayarları
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gobex_db
DB_USER=your_postgres_username
DB_PASS=your_postgres_password

# Sunucu Ayarları
PORT=3000
NODE_ENV=development
```

### 4. PostgreSQL Veritabanı Kurulumu

#### 4.1 PostgreSQL'e bağlanın

```bash
psql -U postgres
```

#### 4.2 Veritabanı oluşturun

```sql
CREATE DATABASE gobex_db;
CREATE USER gobex_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE gobex_db TO gobex_user;
\q
```

> **Not**: `.env` dosyasındaki `DB_USER` ve `DB_PASS` değerlerini yukarıda oluşturduğunuz kullanıcı bilgileri ile güncelleyin.

### 5. Veritabanı Tablolarını Oluşturun

Sequelize migrations kullanarak tabloları oluşturun:

```bash
# Migration'ları çalıştırın
npx sequelize-cli db:migrate

# Migration'ları geri almak için (gerektiğinde)
npx sequelize-cli db:migrate:undo
```

## ▶️ Uygulamayı Çalıştırma

### Development Modu

```bash
npm start
```

Sunucu `http://localhost:3000` adresinde çalışmaya başlayacaktır.

### Test Endpoint'i

Tarayıcınızda veya Postman ile aşağıdaki adrese gidin:

```
GET http://localhost:3000/
```

Beklenen yanıt: `"Gobex Backend is running!"`

## 📁 Proje Yapısı

```
backend/
├── src/
│   ├── app.js                 # Ana uygulama dosyası
│   ├── server.js              # Sunucu başlatma dosyası
│   ├── config/
│   │   └── database.js        # Veritabanı yapılandırması
│   ├── controllers/
│   │   └── anaSayfaController.js  # Ana sayfa controller'ı
│   ├── models/
│   │   ├── index.js           # Model index dosyası
│   │   └── anaSayfa.js        # Ana sayfa modeli
│   ├── routes/
│   │   └── anaSayfaRoutes.js  # Ana sayfa route'ları
│   ├── services/
│   │   └── anaSayfaService.js # Ana sayfa servisleri
│   └── migrations/
│       └── [timestamp]-create-ana-sayfa.js  # Veritabanı migration'ı
├── package.json
├── README.md
└── .env (manuel oluşturulmalı)
```

## 🛠️ Kullanılabilir Scriptler

```bash
# Development sunucusunu başlat
npm start

# Test çalıştır (henüz tanımlanmamış)
npm test
```

## 🔧 Sequelize CLI Komutları

```bash
# Yeni migration oluştur
npx sequelize-cli migration:generate --name create-example-table

# Migration'ları çalıştır
npx sequelize-cli db:migrate

# Migration'ları geri al
npx sequelize-cli db:migrate:undo

# Son migration'ı geri al
npx sequelize-cli db:migrate:undo:all

# Model oluştur
npx sequelize-cli model:generate --name Example --attributes name:string,email:string
```

## 📚 API Endpoint'leri

### Ana Sayfa

- **GET** `/api/anasayfa` - Ana sayfa verilerini getir
- **POST** `/api/anasayfa` - Yeni ana sayfa verisi ekle
- **PUT** `/api/anasayfa/:id` - Ana sayfa verisini güncelle
- **DELETE** `/api/anasayfa/:id` - Ana sayfa verisini sil

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası

1. PostgreSQL servisinin çalıştığından emin olun:
   ```bash
   sudo systemctl status postgresql
   ```

2. `.env` dosyasındaki veritabanı bilgilerini kontrol edin

3. Veritabanı kullanıcısının doğru izinlere sahip olduğunu kontrol edin

### Port Çakışması

Eğer 3000 portu kullanımda ise, `.env` dosyasında farklı bir PORT değeri belirleyin.

### Migration Hatası

Migration'ları sıfırlayıp yeniden çalıştırmak için:

```bash
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

## 📝 Katkıda Bulunma

1. Bu repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje ISC lisansı altında lisanslanmıştır.

---

**Geliştirici:** Mehmet
**Versiyon:** 1.0.0
**Son Güncelleme:** Aralık 2025
