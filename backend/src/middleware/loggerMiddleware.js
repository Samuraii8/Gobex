// Bu middleware her isteği detaylı loglar.
// Hata ayıklama için isteğin nereden geldiğini, ne gönderdiğini ve ne cevap aldığını gösterir.

const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    // URL ve Metod
    console.log(`\n============== REQUEST START [${timestamp}] ==============`);
    console.log(`📡 ${req.method} ${req.originalUrl}`);
    console.log(`🌍 IP: ${req.ip}`);

    // Body (Varsa logla, şifre varsa gizle)
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.sifre) sanitizedBody.sifre = '******** (HIDDEN)';
        if (sanitizedBody.password) sanitizedBody.password = '******** (HIDDEN)';
        console.log('📦 Body:', JSON.stringify(sanitizedBody, null, 2));
    } else {
        console.log('📦 Body: (Empty)');
    }

    // Response bitince logla
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusEmoji = res.statusCode >= 400 ? '❌' : '✅';
        console.log(`${statusEmoji} RESPONSE: ${res.statusCode} ${res.statusMessage} (${duration}ms)`);
        console.log(`============== REQUEST END ==============\n`);
    });

    next();
};

module.exports = loggerMiddleware;
