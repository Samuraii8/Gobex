const express = require('express');
const router = express.Router();
const galeriController = require('../controllers/galeriController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

router.get('/', galeriController.getAllGaleri);
router.get('/:id', galeriController.getGaleriById);

// POST - Resim yüklemeli galeri oluşturma
router.post('/',
    authMiddleware,
    upload.fields([
        { name: 'resim', maxCount: 1 },
        { name: 'detay_resimler', maxCount: 20 }
    ]),
    handleUploadError,
    galeriController.createGaleri
);

// PUT - Resim yüklemeli galeri güncelleme
router.put('/:id',
    authMiddleware,
    upload.fields([
        { name: 'resim', maxCount: 1 },
        { name: 'detay_resimler', maxCount: 20 }
    ]),
    handleUploadError,
    galeriController.updateGaleri
);

router.delete('/:id', authMiddleware, galeriController.deleteGaleri);

// Detay resmi silme (Body: { filename: "..." })
router.delete('/:id/image', authMiddleware, galeriController.deleteGaleriDetailImage);

module.exports = router;