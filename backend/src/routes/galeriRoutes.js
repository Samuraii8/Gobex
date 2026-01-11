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
    upload.single('resim'),
    handleUploadError,
    galeriController.createGaleri
);

// PUT - Resim yüklemeli galeri güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    galeriController.updateGaleri
);

router.delete('/:id', authMiddleware, galeriController.deleteGaleri);

module.exports = router;