const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false, // Tüm hataları görmek için
            stripUnknown: true // Şemada olmayan alanları temizler
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            return res.status(400).json({ message: errorMessage });
        }

        next();
    };
};

module.exports = validate;
