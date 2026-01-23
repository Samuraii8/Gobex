const iletisimService = require('../services/iletisimService');

// GET - Tüm iletişim mesajlarını listele (Admin)
const getAllIletisim = async (req, res) => {
    try {
        const data = await iletisimService.getAllIletisim();
        res.status(200).json(data);
    } catch (error) {
        console.error('GetAllIletisim Error:', error);
        res.status(500).json({ message: 'Mesajlar getirilirken bir hata oluştu.' });
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
        console.error('GetIletisimById Error:', error);
        res.status(500).json({ message: 'Mesaj detayı getirilirken bir hata oluştu.' });
    }
};

// POST - Yeni iletişim mesajı oluştur (Public - Rate Limited)
const createIletisim = async (req, res) => {
    try {
        const { adSoyad, ePosta, konu, mesaj } = req.body;

        const data = await iletisimService.createIletisim({
            adSoyad: adSoyad.trim(),
            ePosta: ePosta.trim().toLowerCase(),
            konu: konu.trim(),
            mesaj: mesaj.trim()
        });

        res.status(201).json({
            message: 'Mesajınız başarıyla gönderildi.',
            id: data.id
        });
    } catch (error) {
        console.error('CreateIletisim Error:', error);
        // Sequelize validation hataları (eğer Joi'den kaçarsa)

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
        console.error('DeleteIletisim Error:', error);
        res.status(500).json({ message: 'Mesaj silinirken bir hata oluştu.' });
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
        console.error('DeleteMultipleIletisim Error:', error);
        res.status(500).json({ message: 'Mesajlar silinirken bir hata oluştu.' });
    }
};

module.exports = {
    getAllIletisim,
    getIletisimById,
    createIletisim,
    deleteIletisim,
    deleteMultipleIletisim,
};

