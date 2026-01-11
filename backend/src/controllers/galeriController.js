const galeriService = require('../services/galeriService');
const path = require('path');
const fs = require('fs');

const getAllGaleri = async (req, res) => {
  try {
    const data = await galeriService.getAllGaleriData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGaleriById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await galeriService.getGaleriDataById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGaleri = async (req, res) => {
  try {
    const { Galeri_başlık, Galeri_açıklaması } = req.body;

    // Dosya yüklendiyse path'i al
    let Galeri_resim = null;
    if (req.file) {
      Galeri_resim = req.file.filename;
    }

    const data = await galeriService.createGaleri({
      Galeri_başlık,
      Galeri_resim,
      Galeri_açıklaması
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

const updateGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const { Galeri_başlık, Galeri_açıklaması } = req.body;

    // Mevcut galeri öğesini al (eski resmi silmek için)
    const existingGaleri = await galeriService.getGaleriDataById(id);
    if (!existingGaleri) {
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

    if (Galeri_başlık) updateData.Galeri_başlık = Galeri_başlık;
    if (Galeri_açıklaması) updateData.Galeri_açıklaması = Galeri_açıklaması;

    // Yeni dosya yüklendiyse
    if (req.file) {
      // Eski dosyayı sil
      if (existingGaleri.Galeri_resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingGaleri.Galeri_resim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.Galeri_resim = req.file.filename;
    }

    const updatedData = await galeriService.updateGaleri(id, updateData);
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

const deleteGaleri = async (req, res) => {
  try {
    const { id } = req.params;

    // Galeri öğesini al (resmi silmek için)
    const galeri = await galeriService.getGaleriDataById(id);
    if (!galeri) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Galeri öğesini sil
    await galeriService.deleteGaleri(id);

    // Resim dosyasını sil
    if (galeri.Galeri_resim) {
      const filePath = path.join(__dirname, '../../public/images', galeri.Galeri_resim);
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
  getAllGaleri,
  getGaleriById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
};