const anaSayfaService = require('../services/anaSayfaService');
const path = require('path');
const fs = require('fs');

const getAllAnaSayfaData = async (req, res) => {
  try {
    const data = await anaSayfaService.getAnaSayfaData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnaSayfa = async (req, res) => {
  try {
    const { Başlık, İçerik } = req.body;

    // Dosya yüklendiyse path'i al
    let Resim = null;
    if (req.file) {
      Resim = req.file.filename;
    }

    const data = await anaSayfaService.createAnaSayfa({
      Başlık,
      İçerik,
      Resim
    });

    res.status(201).json(data);
  } catch (error) {
    // Hata durumunda yüklenen dosyayı sil
    if (req.file) {
      const filePath = path.join(__dirname, '../../public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

const updateAnaSayfa = async (req, res) => {
  try {
    const { id } = req.params;
    const { Başlık, İçerik } = req.body;

    // Mevcut ana sayfa verisini al (eski resmi silmek için)
    const existingData = await anaSayfaService.getAnaSayfaById(id);
    if (!existingData) {
      // Yüklenen dosyayı sil
      if (req.file) {
        const filePath = path.join(__dirname, '../../public/images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    const updateData = {};

    if (Başlık) updateData.Başlık = Başlık;
    if (İçerik) updateData.İçerik = İçerik;

    // Yeni dosya yüklendiyse
    if (req.file) {
      // Eski dosyayı sil
      if (existingData.Resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingData.Resim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.Resim = req.file.filename;
    }

    const updatedData = await anaSayfaService.updateAnaSayfa(id, updateData);
    res.status(200).json(updatedData);
  } catch (error) {
    // Hata durumunda yüklenen dosyayı sil
    if (req.file) {
      const filePath = path.join(__dirname, '../../public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteAnaSayfa = async (req, res) => {
  try {
    const { id } = req.params;

    // Ana sayfa verisini al (resmi silmek için)
    const anaSayfa = await anaSayfaService.getAnaSayfaById(id);
    if (!anaSayfa) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Ana sayfa verisini sil
    await anaSayfaService.deleteAnaSayfa(id);

    // Resim dosyasını sil
    if (anaSayfa.Resim) {
      const filePath = path.join(__dirname, '../../public/images', anaSayfa.Resim);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAnaSayfaData,
  createAnaSayfa,
  updateAnaSayfa,
  deleteAnaSayfa,
};