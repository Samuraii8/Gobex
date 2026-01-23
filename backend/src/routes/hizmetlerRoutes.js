const express = require('express');
const router = express.Router();
const hizmetlerController = require('../controllers/hizmetlerController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validationMiddleware');
const { hizmetSchemas } = require('../validations/schemas');

router.get('/', hizmetlerController.getAllHizmetler);

// POST - Resim yüklemeli hizmet oluşturma
router.post('/',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(hizmetSchemas.createUpdate),
    hizmetlerController.createHizmet
);

// PUT - Resim yüklemeli hizmet güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(hizmetSchemas.createUpdate),
    hizmetlerController.updateHizmet
);

router.delete('/:id', authMiddleware, hizmetlerController.deleteHizmet);

module.exports = router;