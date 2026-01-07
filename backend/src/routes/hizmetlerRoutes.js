const express = require('express');
const router = express.Router();
const hizmetlerController = require('../controllers/hizmetlerController');

router.get('/', hizmetlerController.getAllHizmetler);

module.exports = router;
