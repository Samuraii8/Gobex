const path = require('path');

// POST - Tekil resim yükleme
const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Lütfen bir resim dosyası seçin.' });
        }

        // Frontend'in beklediği format: { url: '/images/dosya_adi.jpg' }
        // req.file.filename, unique olarak oluşturduğumuz dosya adıdır.
        const fileUrl = `/images/${req.file.filename}`;

        res.status(200).json({
            message: 'Resim başarıyla yüklendi.',
            url: fileUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadImage
};
