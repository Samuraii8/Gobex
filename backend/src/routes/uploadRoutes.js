const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload, handleUploadError } = require('../middleware/uploadMiddleware');

// POST /api/upload
// Frontend'deki "image" field adına dikkat ediyoruz.
router.post('/',
    authMiddleware,
    upload.single('image'),
    handleUploadError,
    uploadController.uploadImage
);

module.exports = router;
