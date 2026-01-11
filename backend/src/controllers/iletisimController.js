const iletisimService = require('../services/iletisimService');

// GET - Tüm iletişim mesajlarını listele (Admin)
const getAllIletisim = async (req, res) => {
    try {
        const data = await iletisimService.getAllIletisim();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET - Tek bir iletişim mesajını getir (Admin)
const getIletisimById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await iletisimService.getIletisimById(id);
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Mesaj bulunamadı.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST - Yeni iletişim mesajı oluştur (Public - Rate Limited)
const createIletisim = async (req, res) => {
    try {
        const { Ad_Soyad, E_posta, Konu, Mesaj } = req.body;

        // Temel validasyon
        if (!Ad_Soyad || !E_posta || !Konu || !Mesaj) {
            return res.status(400).json({
                message: 'Tüm alanlar zorunludur.',
                required: ['Ad_Soyad', 'E_posta', 'Konu', 'Mesaj']
            });
        }

        // E-posta format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(E_posta)) {
            return res.status(400).json({ message: 'Geçerli bir e-posta adresi giriniz.' });
        }

        const data = await iletisimService.createIletisim({
            Ad_Soyad: Ad_Soyad.trim(),
            E_posta: E_posta.trim().toLowerCase(),
            Konu: Konu.trim(),
            Mesaj: Mesaj.trim()
        });

        res.status(201).json({
            message: 'Mesajınız başarıyla gönderildi.',
            id: data.İD
        });
    } catch (error) {
        // Sequelize validation hataları
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: messages.join(' ') });
        }
        res.status(500).json({ message: 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin.' });
    }
};

// DELETE - Tek bir iletişim mesajını sil (Admin)
const deleteIletisim = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await iletisimService.deleteIletisim(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Mesaj bulunamadı.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Toplu silme (Admin)
const deleteMultipleIletisim = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Silinecek mesaj ID\'leri belirtilmedi.' });
        }

        const deletedCount = await iletisimService.deleteMultipleIletisim(ids);
        res.status(200).json({
            message: `${deletedCount} mesaj silindi.`,
            deletedCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllIletisim,
    getIletisimById,
    createIletisim,
    deleteIletisim,
    deleteMultipleIletisim,
};
