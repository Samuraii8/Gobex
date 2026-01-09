const express = require('express');
const router = express.Router();
const anaSayfaController = require('../controllers/anaSayfaController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', anaSayfaController.getAllAnaSayfaData);
router.post('/', authMiddleware, anaSayfaController.createAnaSayfa);
router.put('/:id', authMiddleware, anaSayfaController.updateAnaSayfa);
router.delete('/:id', authMiddleware, anaSayfaController.deleteAnaSayfa);

module.exports = router;