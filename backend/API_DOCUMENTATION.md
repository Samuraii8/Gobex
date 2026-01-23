# Gobex Backend Teknik Dokümantasyon

Bu belge, Gobex Backend projesinin teknik mimarisini, veritabanı yapısını ve API endpoint'lerini detaylı olarak açıklar.

**Son Güncelleme:** 23 Ocak 2026
**Base URL:** `http://localhost:3001`

---

## 📚 İçindekiler
1.  [Veritabanı Şeması (Models)](#1-veritabanı-şeması-models)
2.  [API Endpoint'leri](#2-api-endpointleri)
    *   [Kimlik Doğrulama (Auth)](#21-kimlik-doğrulama-auth)
    *   [Slider Yönetimi](#22-slider-yönetimi)
    *   [Hizmetler Yönetimi](#23-hizmetler-yönetimi)
    *   [Galeri Yönetimi](#24-galeri-yönetimi)
    *   [Ana Sayfa İçerik](#25-ana-sayfa-içerik)
    *   [İletişim & Mesajlar](#26-iletişim--mesajlar)
3.  [Güvenlik & Standartlar](#3-güvenlik--standartlar)

---

## 1. Veritabanı Şeması (Models)

Proje **MySQL** veritabanını kullanmakta olup, **Prisma ORM** ile yönetilmektedir.

### 1.1. Admin Tablosu (`Tbl_Admin`)
Yönetici girişleri için kullanılır.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `ad` | STRING | Not Null, Unique | Kullanıcı adı |
| `sifre` | STRING | Not Null | Hashlenmiş şifre (Bcrypt) |

### 1.2. Slider Tablosu (`Tbl_Slider`)
Ana sayfadaki slider görsellerini tutar.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `sliderAd` | STRING | Not Null | Slider başlığı/adı |
| `sliderResim` | STRING | Nullable | Resim dosya adı (örn: `img-123.jpg`) |

### 1.3. Hizmetler Tablosu (`Tbl_Hizmetler`)
Sunulan hizmetlerin listesidir.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `hizmetAdi` | STRING | Not Null | Hizmetin adı |
| `hizmetAciklamasi` | TEXT | Nullable | Hizmet detayı |
| `hizmetKategorisi` | STRING | Nullable | Hizmet kategorisi |
| `hizmetResim` | STRING | Nullable | Resim dosya adı |

### 1.4. Galeri Tablosu (`Tbl_Galeri`)
Galeri öğelerini ve çoklu resimleri tutar.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `galeriBaslik` | STRING | Not Null | Galeri başlığı |
| `galeriAciklamasi` | TEXT | Nullable | Galeri açıklaması |
| `galeriResim` | STRING | Nullable | **Ana Görsel** dosya adı |
| `galeriDetayResimler` | TEXT | Nullable | **Detay Görselleri** (JSON Array String: `["a.jpg","b.jpg"]`) |

### 1.5. Ana Sayfa Tablosu (`Tbl_AnaSayfa`)
Ana sayfa statik içeriklerini yönetir.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `baslik` | STRING | Not Null | İçerik başlığı |
| `icerik` | TEXT | Not Null | İçerik metni |
| `resim` | STRING | Nullable | İçerik resmi |

### 1.6. İletişim Tablosu (`Tbl_Iletisim`)
Kullanıcılardan gelen iletişim formlarını saklar.

| Kolon Adı | Veri Tipi | Özellikler | Açıklama |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PK, AutoIncrement | Benzersiz kayıt ID'si |
| `adSoyad` | STRING | Not Null | Gönderen adı soyadı |
| `ePosta` | STRING | Not Null | Gönderen e-posta adresi |
| `konu` | STRING | Not Null | Mesaj konusu |
| `mesaj` | TEXT | Not Null | Mesaj içeriği |
| `createdAt` | DATETIME | Default: NOW | Gönderim zamanı |

---

## 2. API Endpoint'leri

### 2.1. Kimlik Doğrulama (Auth)

| Method | Endpoint | Auth | Açıklama | Body / Params |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | ❌ JWT Yok | Admin girişi ve Token alma | `{ ad, sifre }` |

### 2.2. Slider Yönetimi

| Method | Endpoint | Auth | Açıklama | Body (Multipart/Form-Data) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/slider` | ❌ JWT Yok | Tüm sliderları listele | - |
| `GET` | `/api/slider/:id` | ❌ JWT Yok | Tekil slider getir | - |
| `POST` | `/api/slider` | ✅ JWT | Yeni slider oluştur | `sliderAd`, `resim` (File) |
| `PUT` | `/api/slider/:id` | ✅ JWT | Slider güncelle | `sliderAd`, `resim` (File) |
| `DELETE` | `/api/slider/:id` | ✅ JWT | Slider sil | - |

### 2.3. Hizmetler Yönetimi

| Method | Endpoint | Auth | Açıklama | Body (Multipart/Form-Data) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/hizmetler` | ❌ JWT Yok | Hizmetleri listele | - |
| `POST` | `/api/hizmetler` | ✅ JWT | Hizmet ekle | `hizmetAdi`, `hizmetAciklamasi`, `hizmetKategorisi`, `resim` (File) |
| `PUT` | `/api/hizmetler/:id` | ✅ JWT | Hizmet güncelle | `hizmetAdi`, `hizmetAciklamasi`, `hizmetKategorisi`, `resim` (File) |
| `DELETE` | `/api/hizmetler/:id` | ✅ JWT | Hizmet sil | - |

### 2.4. Galeri Yönetimi

| Method | Endpoint | Auth | Açıklama | Body (Multipart/Form-Data) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/galeri` | ❌ JWT Yok | Galeriyi listele (Detaylar dahil) | - |
| `GET` | `/api/galeri/:id` | ❌ JWT Yok | Tekil galeri getir | - |
| `POST` | `/api/galeri` | ✅ JWT | Galeri ekle (Çoklu Resim) | `galeriBaslik`, `galeriAciklamasi`, `resim` (File - Ana), `detay_resimler` (File[] - Detay) |
| `PUT` | `/api/galeri/:id` | ✅ JWT | Galeri güncelle | `galeriBaslik`, `galeriAciklamasi`, `resim`, `detay_resimler` |
| `DELETE` | `/api/galeri/:id` | ✅ JWT | Galeri sil (Tüm resimler silinir) | - |
| `DELETE` | `/api/galeri/:id/image`| ✅ JWT | **Tekil Detay Resmi Sil** | JSON Body: `{ "filename": "resim.jpg" }` |

### 2.5. Ana Sayfa İçerik

| Method | Endpoint | Auth | Açıklama | Body (Multipart/Form-Data) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/anasayfa` | ❌ JWT Yok | İçerikleri listele | - |
| `POST` | `/api/anasayfa` | ✅ JWT | İçerik ekle | `baslik`, `icerik`, `resim` (File) |
| `PUT` | `/api/anasayfa/:id` | ✅ JWT | İçerik güncelle | `baslik`, `icerik`, `resim` (File) |
| `DELETE` | `/api/anasayfa/:id` | ✅ JWT | İçerik sil | - |

### 2.6. İletişim & Mesajlar

| Method | Endpoint | Auth | Açıklama | Body | Notlar |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/iletisim` | ❌ JWT Yok | Mesaj gönder | `{adSoyad, ePosta, konu, mesaj}` | Rate Limit: 5/saat |
| `GET` | `/api/iletisim` | ✅ JWT | Mesajları listele | - | - |
| `GET` | `/api/iletisim/:id` | ✅ JWT | Mesaj detayını gör | - | - |
| `DELETE` | `/api/iletisim/:id` | ✅ JWT | Mesajı sil | - | - |
| `DELETE` | `/api/iletisim` | ✅ JWT | Toplu sil (Seçilenler) | `{ ids: [1, 2, 3] }` | - |

---

## 3. Güvenlik & Standartlar

1.  **JWT Authentication:** Admin işlemleri için `Authorization: Bearer <token>` header'ı zorunludur.
2.  **Rate Limiting:**
    *   Genel API: 100 istek / 15 dakika.
    *   Login: 10 istek / 15 dakika (Brute-force koruması).
    *   İletişim Formu: 5 istek / 1 saat (Spam koruması).
3.  **Dosya Yükleme:**
    *   Sadece `jpeg, jpg, png, gif, webp` formatları desteklenir.
    *   Maksimum dosya boyutu: **5MB**.
    *   Dosyalar `public/images` klasöründe saklanır.
4.  **Hata Yönetimi:** Tüm hatalar JSON formatında `{ message: "Hata detayı" }` şeklinde döner.
5.  **Multi-part Upload:** Tüm dosya yükleme işlemleri için `multipart/form-data` content-type kullanılmalıdır. JSON body ile dosya yüklenemez.
