# Gobex Backend API Dokümantasyonu

Bu belge, Gobex Backend projesinde bulunan tüm API endpoint'lerini detaylı olarak açıklamaktadır.

**Base URL:** `http://localhost:3000`

---

## 📋 İçindekiler

1. [Kimlik Doğrulama (Auth)](#1-kimlik-doğrulama-auth)
2. [Ana Sayfa](#2-ana-sayfa)
3. [Galeri](#3-galeri)
4. [Hizmetler](#4-hizmetler)
5. [Slider](#5-slider)
6. [İletişim](#6-i̇letişim)
7. [Dosya Yükleme (Upload)](#7-dosya-yükleme-upload)
8. [Hata Kodları](#8-hata-kodları)

---

## 🔐 Kimlik Doğrulama

Korumalı endpoint'lere (`POST`, `PUT`, `DELETE`) erişim için JWT token gereklidir.

**Header Formatı:**
```
Authorization: Bearer <token>
```

---

## 1. Kimlik Doğrulama (Auth)

### `POST /api/auth/login`

Admin kullanıcı girişi yapar ve JWT token döner.

**Rate Limit:** 15 dakikada en fazla 10 istek.

**Request Body:**
```json
{
  "ad": "string (zorunlu)",
  "sifre": "string (zorunlu)"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Giriş başarısız. Kullanıcı adı veya şifre hatalı."
}
```

---

## 2. Ana Sayfa

### `GET /api/anasayfa`

Tüm ana sayfa içeriklerini listeler.

**Auth:** ❌ Gerekmez

**Response (200 OK):**
```json
[
  {
    "İD": 1,
    "Başlık": "Hoş Geldiniz",
    "İçerik": "Ana sayfa içeriği...",
    "Resim": "anasayfa.jpg"
  }
]
```

---

### `POST /api/anasayfa`

Yeni bir ana sayfa içeriği oluşturur ve resim dosyası yükler.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan      | Tip     | Açıklama                                    |
|-----------|---------|---------------------------------------------|
| `Başlık`  | string  | Ana sayfa başlığı (zorunlu)                 |
| `İçerik`  | string  | Ana sayfa içeriği (zorunlu)                 |
| `resim`   | file    | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/anasayfa \
  -H "Authorization: Bearer <token>" \
  -F "Başlık=Hoş Geldiniz" \
  -F "İçerik=Ana sayfa içeriği..." \
  -F "resim=@/path/to/image.jpg"
```

**Response (201 Created):**
```json
{
  "İD": 2,
  "Başlık": "Yeni Başlık",
  "İçerik": "Yeni içerik...",
  "Resim": "1736610000000-123456789.jpg"
}
```

---

### `PUT /api/anasayfa/:id`

Belirtilen ID'ye sahip ana sayfa içeriğini günceller. Yeni resim yüklenirse eski resim otomatik silinir.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**URL Parametreleri:**
| Parametre | Tip     | Açıklama              |
|-----------|---------|----------------------|
| `id`      | Integer | Güncellenecek kayıt ID'si |

**Form Data:**
| Alan      | Tip     | Açıklama                                    |
|-----------|---------|---------------------------------------------|
| `Başlık`  | string  | Ana sayfa başlığı (opsiyonel)               |
| `İçerik`  | string  | Ana sayfa içeriği (opsiyonel)               |
| `resim`   | file    | Yeni resim dosyası (opsiyonel - max 5MB)    |

**Response (200 OK):**
```json
{
  "İD": 1,
  "Başlık": "Güncellenmiş Başlık",
  "İçerik": "Güncellenmiş içerik...",
  "Resim": "1736610500000-987654321.jpg"
}
```

---

### `DELETE /api/anasayfa/:id`

Belirtilen ID'ye sahip ana sayfa içeriğini ve ilişkili resim dosyasını siler.

**Auth:** ✅ JWT Token Gerekli

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Silinecek kayıt ID'si |

**Response (204 No Content):** Başarılı, gövde yok.


---

## 3. Galeri

### `GET /api/galeri`

Tüm galeri öğelerini listeler.

**Auth:** ❌ Gerekmez

**Response (200 OK):**
```json
[
  {
    "İD": 1,
    "Galeri_başlık": "Proje 1",
    "Galeri_resim": "proje1.jpg"
  }
]
```

---

### `GET /api/galeri/:id`

Belirtilen ID'ye sahip galeri öğesini getirir.

**Auth:** ❌ Gerekmez

**URL Parametreleri:**
| Parametre | Tip     | Açıklama          |
|-----------|---------|-------------------|
| `id`      | Integer | Galeri öğesi ID'si|

**Response (200 OK):**
```json
{
  "İD": 1,
  "Galeri_başlık": "Proje 1",
  "Galeri_resim": "proje1.jpg",
  "Galeri_açıklaması": "Bu proje hakkında detaylı bilgi..."
}
```

**Response (404 Not Found):**
```json
{
  "message": "Galeri öğesi bulunamadı."
}
```

---

### `POST /api/galeri`

Yeni bir galeri öğesi oluşturur ve resim dosyası yükler.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan               | Tip     | Açıklama                                    |
|--------------------|---------|---------------------------------------------|
| `Galeri_başlık`    | string  | Galeri başlığı (zorunlu)                    |
| `Galeri_açıklaması`| string  | Galeri açıklaması (opsiyonel)               |
| `resim`            | file    | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/galeri \
  -H "Authorization: Bearer <token>" \
  -F "Galeri_başlık=Yeni Proje" \
  -F "Galeri_açıklaması=Proje açıklaması..." \
  -F "resim=@/path/to/image.jpg"
```

**Response (201 Created):**
```json
{
  "İD": 2,
  "Galeri_başlık": "Yeni Proje",
  "Galeri_resim": "1736610000000-123456789.jpg",
  "Galeri_açıklaması": "Açıklama..."
}
```

---

### `PUT /api/galeri/:id`

Belirtilen ID'ye sahip galeri öğesini günceller. Yeni resim yüklenirse eski resim otomatik silinir.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**URL Parametreleri:**
| Parametre | Tip     | Açıklama              |
|-----------|---------|----------------------|
| `id`      | Integer | Güncellenecek kayıt ID'si |

**Form Data:**
| Alan               | Tip     | Açıklama                                    |
|--------------------|---------|---------------------------------------------|
| `Galeri_başlık`    | string  | Galeri başlığı (opsiyonel)                  |
| `Galeri_açıklaması`| string  | Galeri açıklaması (opsiyonel)               |
| `resim`            | file    | Yeni resim dosyası (opsiyonel - max 5MB)    |

**Response (200 OK):**
```json
{
  "İD": 1,
  "Galeri_başlık": "Güncellenmiş Başlık",
  "Galeri_resim": "1736610500000-987654321.jpg",
  "Galeri_açıklaması": "Güncellenmiş açıklama..."
}
```

---

### `DELETE /api/galeri/:id`

Belirtilen ID'ye sahip galeri öğesini ve ilişkili resim dosyasını siler.

**Auth:** ✅ JWT Token Gerekli

**URL Parametreleri:**
| Parametre | Tip     | Açıklama          |
|-----------|---------|-------------------|
| `id`      | Integer | Silinecek kayıt ID'si |

**Response (204 No Content):** Başarılı, gövde yok.

---

## 4. Hizmetler

### `GET /api/hizmetler`

Tüm hizmetleri listeler.

**Auth:** ❌ Gerekmez

**Response (200 OK):**
```json
[
  {
    "İD": 1,
    "Hizmet_adı": "Web Geliştirme",
    "Hizmet_açıklaması": "Modern web uygulamaları geliştiriyoruz.",
    "Hizmet_Kategorisi": "Yazılım",
    "Hizmet_resim": "web.jpg"
  }
]
```

---

### `POST /api/hizmetler`

Yeni bir hizmet oluşturur ve resim dosyası yükler.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan                | Tip     | Açıklama                                    |
|---------------------|---------|---------------------------------------------|
| `Hizmet_adı`        | string  | Hizmet adı (zorunlu)                        |
| `Hizmet_açıklaması` | string  | Hizmet açıklaması (opsiyonel)               |
| `Hizmet_Kategorisi` | string  | Hizmet kategorisi (opsiyonel)               |
| `resim`             | file    | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/hizmetler \
  -H "Authorization: Bearer <token>" \
  -F "Hizmet_adı=Web Geliştirme" \
  -F "Hizmet_açıklaması=Modern web uygulamaları..." \
  -F "Hizmet_Kategorisi=Yazılım" \
  -F "resim=@/path/to/image.jpg"
```

**Response (201 Created):**
```json
{
  "İD": 2,
  "Hizmet_adı": "Mobil Uygulama",
  "Hizmet_açıklaması": "iOS ve Android uygulamaları...",
  "Hizmet_Kategorisi": "Yazılım",
  "Hizmet_resim": "1736610000000-123456789.jpg"
}
```

---

### `PUT /api/hizmetler/:id`

Belirtilen ID'ye sahip hizmeti günceller. Yeni resim yüklenirse eski resim otomatik silinir.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**URL Parametreleri:**
| Parametre | Tip     | Açıklama              |
|-----------|---------|----------------------|
| `id`      | Integer | Güncellenecek kayıt ID'si |

**Form Data:**
| Alan                | Tip     | Açıklama                                    |
|---------------------|---------|---------------------------------------------|
| `Hizmet_adı`        | string  | Hizmet adı (opsiyonel)                      |
| `Hizmet_açıklaması` | string  | Hizmet açıklaması (opsiyonel)               |
| `Hizmet_Kategorisi` | string  | Hizmet kategorisi (opsiyonel)               |
| `resim`             | file    | Yeni resim dosyası (opsiyonel - max 5MB)    |

**Response (200 OK):**
```json
{
  "İD": 1,
  "Hizmet_adı": "Güncellenmiş Hizmet",
  "Hizmet_açıklaması": "Yeni açıklama...",
  "Hizmet_Kategorisi": "Yeni Kategori",
  "Hizmet_resim": "1736610500000-987654321.jpg"
}
```

---

### `DELETE /api/hizmetler/:id`

Belirtilen ID'ye sahip hizmeti ve ilişkili resim dosyasını siler.

**Auth:** ✅ JWT Token Gerekli

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Silinecek kayıt ID'si |

**Response (204 No Content):** Başarılı, gövde yok.

---

## 5. Slider

### `GET /api/slider`

Tüm slider öğelerini listeler.

**Auth:** ❌ Gerekmez

**Response (200 OK):**
```json
[
  {
    "İD": 1,
    "Slider_ad": "Ana Banner",
    "Slider_resim": "banner1.jpg"
  }
]
```

---

### `GET /api/slider/:id`

Belirtilen ID'ye sahip slider öğesini getirir.

**Auth:** ❌ Gerekmez

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Slider öğesi ID'si |

**Response (200 OK):**
```json
{
  "İD": 1,
  "Slider_ad": "Ana Banner",
  "Slider_resim": "banner1.jpg"
}
```

**Response (404 Not Found):**
```json
{
  "message": "Slider öğesi bulunamadı."
}
```

---

### `POST /api/slider`

Yeni bir slider öğesi oluşturur ve resim dosyası yükler.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan        | Tip     | Açıklama                                    |
|-------------|---------|---------------------------------------------|
| `Slider_ad` | string  | Slider adı (zorunlu)                        |
| `resim`     | file    | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/slider \
  -H "Authorization: Bearer <token>" \
  -F "Slider_ad=Ana Banner" \
  -F "resim=@/path/to/image.jpg"
```

**Response (201 Created):**
```json
{
  "İD": 2,
  "Slider_ad": "Yeni Banner",
  "Slider_resim": "1736610000000-123456789.jpg"
}
```

**Not:** `Slider_resim` alanı otomatik olarak oluşturulan benzersiz dosya adını içerir. Resme şu URL ile erişilebilir: `http://localhost:3000/images/<Slider_resim>`

---

### `PUT /api/slider/:id`

Belirtilen ID'ye sahip slider öğesini günceller. Yeni resim yüklenirse eski resim otomatik silinir.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**URL Parametreleri:**
| Parametre | Tip     | Açıklama              |
|-----------|---------|----------------------|
| `id`      | Integer | Güncellenecek kayıt ID'si |

**Form Data:**
| Alan        | Tip     | Açıklama                                    |
|-------------|---------|---------------------------------------------|
| `Slider_ad` | string  | Slider adı (opsiyonel)                      |
| `resim`     | file    | Yeni resim dosyası (opsiyonel - max 5MB)    |

**Örnek cURL İsteği:**
```bash
curl -X PUT http://localhost:3000/api/slider/1 \
  -H "Authorization: Bearer <token>" \
  -F "Slider_ad=Güncellenmiş Banner" \
  -F "resim=@/path/to/new_image.jpg"
```

**Response (200 OK):**
```json
{
  "İD": 1,
  "Slider_ad": "Güncellenmiş Banner",
  "Slider_resim": "1736610500000-987654321.jpg"
}
```

---

### `DELETE /api/slider/:id`

Belirtilen ID'ye sahip slider öğesini ve ilişkili resim dosyasını siler.

**Auth:** ✅ JWT Token Gerekli

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Silinecek kayıt ID'si |

**Response (204 No Content):** Başarılı, gövde yok.

---

## 6. İletişim

İletişim formu için API endpoint'leri. Ziyaretçiler mesaj gönderebilir, adminler mesajları yönetebilir.

### `POST /api/iletisim`

Yeni bir iletişim mesajı gönderir. **Spam koruması için sert rate limiting uygulanır.**

**Auth:** ❌ Gerekmez (Public)

**Rate Limit:** ⚠️ **1 saatte en fazla 5 mesaj** (IP bazlı)

**Request Body:**
```json
{
  "Ad_Soyad": "string (zorunlu, 2-100 karakter)",
  "E_posta": "string (zorunlu, geçerli e-posta)",
  "Konu": "string (zorunlu, 3-200 karakter)",
  "Mesaj": "string (zorunlu, 10-5000 karakter)"
}
```

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/iletisim \
  -H "Content-Type: application/json" \
  -d '{
    "Ad_Soyad": "Mehmet Yılmaz",
    "E_posta": "mehmet@example.com",
    "Konu": "İş Birliği Teklifi",
    "Mesaj": "Merhaba, projenizle ilgili görüşmek istiyorum..."
  }'
```

**Response (201 Created):**
```json
{
  "message": "Mesajınız başarıyla gönderildi.",
  "id": 1
}
```

**Response (429 Too Many Requests):**
```json
{
  "message": "Çok fazla mesaj gönderdiniz. Lütfen 1 saat sonra tekrar deneyin.",
  "retryAfter": "1 saat"
}
```

---

### `GET /api/iletisim`

Tüm iletişim mesajlarını listeler (en yeniden eskiye).

**Auth:** ✅ JWT Token Gerekli (Admin)

**Response (200 OK):**
```json
[
  {
    "İD": 1,
    "Ad_Soyad": "Mehmet Yılmaz",
    "E_posta": "mehmet@example.com",
    "Konu": "İş Birliği Teklifi",
    "Mesaj": "Merhaba, projenizle ilgili görüşmek istiyorum...",
    "createdAt": "2026-01-11T16:00:00.000Z"
  }
]
```

---

### `GET /api/iletisim/:id`

Belirtilen ID'ye sahip mesajı getirir.

**Auth:** ✅ JWT Token Gerekli (Admin)

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Mesaj ID'si        |

**Response (200 OK):**
```json
{
  "İD": 1,
  "Ad_Soyad": "Mehmet Yılmaz",
  "E_posta": "mehmet@example.com",
  "Konu": "İş Birliği Teklifi",
  "Mesaj": "Merhaba, projenizle ilgili görüşmek istiyorum...",
  "createdAt": "2026-01-11T16:00:00.000Z"
}
```

---

### `DELETE /api/iletisim/:id`

Belirtilen ID'ye sahip mesajı siler.

**Auth:** ✅ JWT Token Gerekli (Admin)

**URL Parametreleri:**
| Parametre | Tip     | Açıklama           |
|-----------|---------|-------------------|
| `id`      | Integer | Silinecek mesaj ID'si |

**Response (204 No Content):** Başarılı, gövde yok.

---

### `DELETE /api/iletisim`

Birden fazla mesajı toplu olarak siler.

**Auth:** ✅ JWT Token Gerekli (Admin)

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response (200 OK):**
```json
{
  "message": "3 mesaj silindi.",
  "deletedCount": 3
}
```

---

---

## 7. Dosya Yükleme (Upload)

Harici resim yükleme endpoint'i. Frontend'in bağımsız resim yükleyip URL alması için kullanılır.

### `POST /api/upload`

Resim dosyası yükler ve dosya URL'ini döner.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan    | Tip  | Açıklama                                       |
|---------|------|------------------------------------------------|
| `image` | file | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"
```

**Response (200 OK):**
```json
{
  "message": "Resim başarıyla yüklendi.",
  "url": "/images/1736610000000-123456789.jpg",
  "filename": "1736610000000-123456789.jpg"
}
## 7. Dosya Yükleme (Upload)

Harici resim yükleme endpoint'i. Frontend'in bağımsız resim yükleyip URL alması için kullanılır.

### `POST /api/upload`

Resim dosyası yükler ve dosya URL'ini döner.

**Auth:** ✅ JWT Token Gerekli

**Content-Type:** `multipart/form-data`

**Form Data:**
| Alan    | Tip  | Açıklama                                       |
|---------|------|------------------------------------------------|
| `image` | file | Resim dosyası (png, jpg, gif, webp, svg - max 5MB) |

**Örnek cURL İsteği:**
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"
```

**Response (200 OK):**
```json
{
  "message": "Resim başarıyla yüklendi.",
  "url": "/images/1736610000000-123456789.jpg",
  "filename": "1736610000000-123456789.jpg"
}
```

---

```

---

## 8. Hata Kodları

| Kod | Açıklama                                      |
|-----|----------------------------------------------|
| 200 | İstek başarılı                               |
| 201 | Kayıt başarıyla oluşturuldu                  |
| 204 | İşlem başarılı, dönen veri yok               |
| 400 | Geçersiz istek (eksik veya hatalı parametreler) |
| 401 | Yetkisiz erişim (geçersiz veya eksik token)  |
| 403 | Token gerekli                                |
| 404 | Kayıt bulunamadı                             |
| 429 | Çok fazla istek (rate limit aşıldı)          |
| 500 | Sunucu hatası                                |

---

## 🛡️ Güvenlik Notları

- **Rate Limiting:** Tüm `/api/*` endpoint'leri 15 dakikada 100 istek ile sınırlıdır.
- **Auth Rate Limiting:** `/api/auth/login` endpoint'i 15 dakikada 10 istek ile sınırlıdır (brute-force koruması).
- **İletişim Rate Limiting:** `/api/iletisim` POST endpoint'i **1 saatte 5 mesaj** ile sınırlıdır (spam koruması).
- **Helmet:** HTTP güvenlik başlıkları aktif.
- **CORS:** Cross-Origin Resource Sharing aktif.
- **Body Limit:** Request body boyutu 10KB ile sınırlı (DoS koruması).

---

## 📁 Statik Dosyalar

Resim dosyalarına şu URL üzerinden erişilebilir:

```
GET /images/<dosya_adı>
```

**Örnek:** `http://localhost:3000/images/banner1.jpg`

---

*Son güncelleme: 11 Ocak 2026*
