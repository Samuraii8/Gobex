const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', sliderController.getAllSlider);
router.get('/:id', sliderController.getSliderById);
router.post('/', authMiddleware, sliderController.createSlider);
router.put('/:id', authMiddleware, sliderController.updateSlider);
router.delete('/:id', authMiddleware, sliderController.deleteSlider);

module.exports = router;
