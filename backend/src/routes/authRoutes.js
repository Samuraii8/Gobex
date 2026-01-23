const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validationMiddleware');
const { authSchemas } = require('../validations/schemas');

router.post('/login', validate(authSchemas.login), authController.login);

module.exports = router;

