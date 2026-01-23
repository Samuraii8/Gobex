const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error('SERVER ERROR:', {
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            url: req.originalUrl,
            method: req.method,
            body: req.body,
            user: req.user ? req.user.id : 'Guest'
        });
    }

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500
        ? 'Sunucu tarafında bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'
        : err.message;

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
