const hizmetlerService = require('../services/hizmetlerService');
const path = require('path');
const fs = require('fs');

const getAllHizmetler = async (req, res) => {
  try {
    const data = await hizmetlerService.getAllHizmetlerData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createHizmet = async (req, res) => {
  try {
    const { Hizmet_adı, Hizmet_açıklaması, Hizmet_Kategorisi } = req.body;

    // Dosya yüklendiyse path'i al
    let Hizmet_resim = null;
    if (req.file) {
      Hizmet_resim = req.file.filename;
    }

    const data = await hizmetlerService.createHizmet({
      Hizmet_adı,
      Hizmet_açıklaması,
      Hizmet_Kategorisi,
      Hizmet_resim
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

const updateHizmet = async (req, res) => {
  try {
    const { id } = req.params;
    const { Hizmet_adı, Hizmet_açıklaması, Hizmet_Kategorisi } = req.body;

    // Mevcut hizmeti al (eski resmi silmek için)
    const existingHizmet = await hizmetlerService.getHizmetById(id);
    if (!existingHizmet) {
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

    if (Hizmet_adı) updateData.Hizmet_adı = Hizmet_adı;
    if (Hizmet_açıklaması) updateData.Hizmet_açıklaması = Hizmet_açıklaması;
    if (Hizmet_Kategorisi) updateData.Hizmet_Kategorisi = Hizmet_Kategorisi;

    // Yeni dosya yüklendiyse
    if (req.file) {
      // Eski dosyayı sil
      if (existingHizmet.Hizmet_resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingHizmet.Hizmet_resim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.Hizmet_resim = req.file.filename;
    }

    const updatedData = await hizmetlerService.updateHizmet(id, updateData);
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

const deleteHizmet = async (req, res) => {
  try {
    const { id } = req.params;

    // Hizmeti al (resmi silmek için)
    const hizmet = await hizmetlerService.getHizmetById(id);
    if (!hizmet) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Hizmeti sil
    await hizmetlerService.deleteHizmet(id);

    // Resim dosyasını sil
    if (hizmet.Hizmet_resim) {
      const filePath = path.join(__dirname, '../../public/images', hizmet.Hizmet_resim);
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
  getAllHizmetler,
  createHizmet,
  updateHizmet,
  deleteHizmet,
};