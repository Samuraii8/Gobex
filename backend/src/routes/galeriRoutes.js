const express = require('express');
const router = express.Router();
const galeriController = require('../controllers/galeriController');

router.get('/', galeriController.getAllGaleri);
router.get('/:id', galeriController.getGaleriById);

module.exports = router;
