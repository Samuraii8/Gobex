const express = require('express');
const router = express.Router();
const hizmetlerController = require('../controllers/hizmetlerController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

router.get('/', hizmetlerController.getAllHizmetler);

// POST - Resim yüklemeli hizmet oluşturma
router.post('/',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    hizmetlerController.createHizmet
);

// PUT - Resim yüklemeli hizmet güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    hizmetlerController.updateHizmet
);

router.delete('/:id', authMiddleware, hizmetlerController.deleteHizmet);

module.exports = router;