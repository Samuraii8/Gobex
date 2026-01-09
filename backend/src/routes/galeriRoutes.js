const express = require('express');
const router = express.Router();
const galeriController = require('../controllers/galeriController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', galeriController.getAllGaleri);
router.get('/:id', galeriController.getGaleriById);
router.post('/', authMiddleware, galeriController.createGaleri);
router.put('/:id', authMiddleware, galeriController.updateGaleri);
router.delete('/:id', authMiddleware, galeriController.deleteGaleri);

module.exports = router;