const Joi = require('joi');

const authSchemas = {
    login: Joi.object({
        ad: Joi.string().required().messages({
            'any.required': 'Kullanıcı adı zorunludur.',
            'string.empty': 'Kullanıcı adı boş olamaz.'
        }),
        sifre: Joi.string().required().messages({
            'any.required': 'Şifre zorunludur.',
            'string.empty': 'Şifre boş olamaz.'
        })
    })
};

const iletisimSchemas = {
    create: Joi.object({
        adSoyad: Joi.string().min(3).max(100).required().messages({
            'string.min': 'Ad Soyad en az 3 karakter olmalıdır.',
            'any.required': 'Ad Soyad alanı zorunludur.'
        }),
        ePosta: Joi.string().email().required().messages({
            'string.email': 'Geçerli bir e-posta adresi giriniz.',
            'any.required': 'E-posta alanı zorunludur.'
        }),
        konu: Joi.string().min(3).max(200).required().messages({
            'string.min': 'Konu en az 3 karakter olmalıdır.',
            'any.required': 'Konu alanı zorunludur.'
        }),
        mesaj: Joi.string().min(10).max(2000).required().messages({
            'string.min': 'Mesaj en az 10 karakter olmalıdır.',
            'any.required': 'Mesaj alanı zorunludur.'
        })
    })
};

const sliderSchemas = {
    createUpdate: Joi.object({
        sliderAd: Joi.string().min(2).max(100).required().messages({
            'string.min': 'Slider adı en az 2 karakter olmalıdır.',
            'any.required': 'Slider adı zorunludur.'
        })
    })
};

const hizmetSchemas = {
    createUpdate: Joi.object({
        hizmetAdi: Joi.string().min(3).max(100).required().messages({
            'string.min': 'Hizmet adı en az 3 karakter olmalıdır.',
            'any.required': 'Hizmet adı zorunludur.'
        }),
        hizmetAciklamasi: Joi.string().allow('', null),
        hizmetKategorisi: Joi.string().allow('', null)
    })
};

const galeriSchemas = {
    createUpdate: Joi.object({
        galeriBaslik: Joi.string().min(3).max(100).required().messages({
            'string.min': 'Galeri başlığı en az 3 karakter olmalıdır.',
            'any.required': 'Galeri başlığı zorunludur.'
        }),
        galeriAciklamasi: Joi.string().allow('', null)
    })
};

const anaSayfaSchemas = {
    createUpdate: Joi.object({
        baslik: Joi.string().min(3).max(200).required().messages({
            'string.min': 'Başlık en az 3 karakter olmalıdır.',
            'any.required': 'Başlık zorunludur.'
        }),
        icerik: Joi.string().min(10).required().messages({
            'string.min': 'İçerik en az 10 karakter olmalıdır.',
            'any.required': 'İçerik zorunludur.'
        })
    })
};

module.exports = {
    authSchemas,
    iletisimSchemas,
    sliderSchemas,
    hizmetSchemas,
    galeriSchemas,
    anaSayfaSchemas
};
