const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validationMiddleware');
const { sliderSchemas } = require('../validations/schemas');

router.get('/', sliderController.getAllSlider);
router.get('/:id', sliderController.getSliderById);

// POST - Resim yüklemeli slider oluşturma
router.post('/',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(sliderSchemas.createUpdate),
    sliderController.createSlider
);

// PUT - Resim yüklemeli slider güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    validate(sliderSchemas.createUpdate),
    sliderController.updateSlider
);

router.delete('/:id', authMiddleware, sliderController.deleteSlider);

module.exports = router;

