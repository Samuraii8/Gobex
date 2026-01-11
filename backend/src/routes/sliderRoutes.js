const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

router.get('/', sliderController.getAllSlider);
router.get('/:id', sliderController.getSliderById);

// POST - Resim yüklemeli slider oluşturma
router.post('/',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    sliderController.createSlider
);

// PUT - Resim yüklemeli slider güncelleme
router.put('/:id',
    authMiddleware,
    upload.single('resim'),
    handleUploadError,
    sliderController.updateSlider
);

router.delete('/:id', authMiddleware, sliderController.deleteSlider);

module.exports = router;
