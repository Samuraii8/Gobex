const galeriService = require('../services/galeriService');
const path = require('path');
const fs = require('fs');

const getAllGaleri = async (req, res) => {
  try {
    const data = await galeriService.getAllGaleriData();
    // JSON string olan alanları parse edip dönmek frontend için kolaylık sağlar
    const parsedData = data.map(item => {
      const plainItem = item.get({ plain: true });
      if (plainItem.Galeri_Detay_Resimler) {
        try {
          plainItem.Galeri_Detay_Resimler = JSON.parse(plainItem.Galeri_Detay_Resimler);
        } catch (e) {
          plainItem.Galeri_Detay_Resimler = [];
        }
      }
      return plainItem;
    });
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGaleriById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await galeriService.getGaleriDataById(id);
    if (data) {
      const plainItem = data.get({ plain: true });
      if (plainItem.Galeri_Detay_Resimler) {
        try {
          plainItem.Galeri_Detay_Resimler = JSON.parse(plainItem.Galeri_Detay_Resimler);
        } catch (e) {
          plainItem.Galeri_Detay_Resimler = [];
        }
      }
      res.status(200).json(plainItem);
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

    let Galeri_resim = null;
    let detailImages = [];

    // Dosyaları işle
    if (req.files) {
      // Ana resim
      if (req.files['resim'] && req.files['resim'][0]) {
        Galeri_resim = req.files['resim'][0].filename;
      }
      // Detay resimler
      if (req.files['detay_resimler']) {
        detailImages = req.files['detay_resimler'].map(f => f.filename);
      }
    }

    const data = await galeriService.createGaleri({
      Galeri_başlık,
      Galeri_resim,
      Galeri_açıklaması,
      Galeri_Detay_Resimler: JSON.stringify(detailImages)
    });

    res.status(201).json(data);
  } catch (error) {
    // Hata durumunda yüklenen tüm dosyaları sil
    if (req.files) {
      const allFiles = [
        ...(req.files['resim'] || []),
        ...(req.files['detay_resimler'] || [])
      ];
      allFiles.forEach(file => {
        const filePath = path.join(__dirname, '../../public/images', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const { Galeri_başlık, Galeri_açıklaması } = req.body;

    const existingGaleri = await galeriService.getGaleriDataById(id);
    if (!existingGaleri) {
      // Hata: Kayıt yok, yüklenen dosyaları sil
      if (req.files) {
        const allFiles = [
          ...(req.files['resim'] || []),
          ...(req.files['detay_resimler'] || [])
        ];
        allFiles.forEach(file => {
          const filePath = path.join(__dirname, '../../public/images', file.filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      }
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    const updateData = {};

    if (Galeri_başlık) updateData.Galeri_başlık = Galeri_başlık;
    if (Galeri_açıklaması) updateData.Galeri_açıklaması = Galeri_açıklaması;

    // Ana resim güncellemesi
    if (req.files && req.files['resim'] && req.files['resim'][0]) {
      // Eski ana resmi sil
      if (existingGaleri.Galeri_resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingGaleri.Galeri_resim);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      updateData.Galeri_resim = req.files['resim'][0].filename;
    }

    // Detay resim güncellemesi (EKLEME MANTIĞI)
    if (req.files && req.files['detay_resimler']) {
      let currentDetails = [];
      try {
        currentDetails = JSON.parse(existingGaleri.Galeri_Detay_Resimler || '[]');
      } catch (e) { currentDetails = []; }

      const newDetails = req.files['detay_resimler'].map(f => f.filename);
      const combinedDetails = [...currentDetails, ...newDetails];

      updateData.Galeri_Detay_Resimler = JSON.stringify(combinedDetails);
    }

    const updatedData = await galeriService.updateGaleri(id, updateData);
    res.status(200).json(updatedData);
  } catch (error) {
    if (req.files) {
      const allFiles = [
        ...(req.files['resim'] || []),
        ...(req.files['detay_resimler'] || [])
      ];
      allFiles.forEach(file => {
        const filePath = path.join(__dirname, '../../public/images', file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const galeri = await galeriService.getGaleriDataById(id);
    if (!galeri) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Kaydı sil
    await galeriService.deleteGaleri(id);

    // Ana resmi sil
    if (galeri.Galeri_resim) {
      const filePath = path.join(__dirname, '../../public/images', galeri.Galeri_resim);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Detay resimleri sil
    if (galeri.Galeri_Detay_Resimler) {
      try {
        const details = JSON.parse(galeri.Galeri_Detay_Resimler);
        details.forEach(filename => {
          const filePath = path.join(__dirname, '../../public/images', filename);
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
      } catch (e) {
        console.error('Detay resimler silinirken hata:', e);
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sadece tek bir detay resmini silmek için özel endpoint
const deleteGaleriDetailImage = async (req, res) => {
  try {
    const { id } = req.params; // Galeri ID
    const { filename } = req.body; // Silinecek dosya adı

    const galeri = await galeriService.getGaleriDataById(id);
    if (!galeri) return res.status(404).json({ message: 'Kayıt bulunamadı.' });

    let details = [];
    try {
      details = JSON.parse(galeri.Galeri_Detay_Resimler || '[]');
    } catch (e) { details = []; }

    // Dosya listede var mı?
    if (!details.includes(filename)) {
      return res.status(404).json({ message: 'Resim bulunamadı.' });
    }

    // Listeden çıkar
    const newDetails = details.filter(f => f !== filename);

    // DB güncelle
    await galeriService.updateGaleri(id, {
      Galeri_Detay_Resimler: JSON.stringify(newDetails)
    });

    // Dosyayı diskten sil
    const filePath = path.join(__dirname, '../../public/images', filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Detay resmi silindi.', currentImages: newDetails });

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
  deleteGaleriDetailImage
};