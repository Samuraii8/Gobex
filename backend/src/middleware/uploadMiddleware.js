const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Upload dizinini oluştur (yoksa)
const uploadDir = path.join(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage konfigürasyonu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    }, filename: (req, file, cb) => {
        // Benzersiz dosya adı oluştur: timestamp + random + orijinal uzantı
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    }

});

// Dosya filtresi - sadece resim dosyaları
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir (jpeg, jpg, png, gif, webp)'), false);
    }
};

// Multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maksimum 5MB
    },
    fileFilter: fileFilter
});

// Hata yakalama middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Dosya boyutu 5MB\'dan büyük olamaz.' });
        }
        return res.status(400).json({ message: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = {
    upload,
    handleUploadError
};
