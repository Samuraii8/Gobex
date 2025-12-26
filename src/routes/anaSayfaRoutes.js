const express = require('express');
const router = express.Router();
const anaSayfaController = require('../controllers/anaSayfaController');

router.get('/', anaSayfaController.getAllAnaSayfaData);

module.exports = router;
