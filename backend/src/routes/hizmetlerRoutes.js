const express = require('express');
const router = express.Router();
const hizmetlerController = require('../controllers/hizmetlerController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', hizmetlerController.getAllHizmetler);
router.post('/', authMiddleware, hizmetlerController.createHizmet);
router.put('/:id', authMiddleware, hizmetlerController.updateHizmet);
router.delete('/:id', authMiddleware, hizmetlerController.deleteHizmet);

module.exports = router;