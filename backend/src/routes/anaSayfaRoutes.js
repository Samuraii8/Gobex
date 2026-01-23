const express = require('express');
const router = express.Router();
const anaSayfaController = require('../controllers/anaSayfaController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validationMiddleware');
const { anaSayfaSchemas } = require('../validations/schemas');

router.get('/', anaSayfaController.getAllAnaSayfaData);

// POST - Resim yüklemeli ana sayfa içeriği oluşturma
router.post('/',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(anaSayfaSchemas.createUpdate),
    anaSayfaController.createAnaSayfa
);

// PUT - Resim yüklemeli ana sayfa güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(anaSayfaSchemas.createUpdate),
    anaSayfaController.updateAnaSayfa
);

router.delete('/:id', authMiddleware, anaSayfaController.deleteAnaSayfa);

module.exports = router;