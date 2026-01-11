const galeriService = require('../services/galeriService');
const path = require('path');
const fs = require('fs');

const getAllGaleri = async (req, res) => {
  try {
    const data = await galeriService.getAllGaleriData();
    const parsedData = data.map(item => {
      const plainItem = item.get({ plain: true });
      if (plainItem.galeriDetayResimler) {
        try {
          plainItem.galeriDetayResimler = JSON.parse(plainItem.galeriDetayResimler);
        } catch (e) {
          plainItem.galeriDetayResimler = [];
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
      if (plainItem.galeriDetayResimler) {
        try {
          plainItem.galeriDetayResimler = JSON.parse(plainItem.galeriDetayResimler);
        } catch (e) {
          plainItem.galeriDetayResimler = [];
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
    const { galeriBaslik, galeriAciklamasi } = req.body;

    let galeriResim = null;
    let detailImages = [];

    if (req.files) {
      if (req.files['resim'] && req.files['resim'][0]) {
        galeriResim = req.files['resim'][0].filename;
      }
      if (req.files['detay_resimler']) {
        detailImages = req.files['detay_resimler'].map(f => f.filename);
      }
    }

    const data = await galeriService.createGaleri({
      galeriBaslik,
      galeriResim,
      galeriAciklamasi,
      galeriDetayResimler: JSON.stringify(detailImages)
    });

    res.status(201).json(data);
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

const updateGaleri = async (req, res) => {
  try {
    const { id } = req.params;
    const { galeriBaslik, galeriAciklamasi } = req.body;

    const existingGaleri = await galeriService.getGaleriDataById(id);
    if (!existingGaleri) {
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

    if (galeriBaslik) updateData.galeriBaslik = galeriBaslik;
    if (galeriAciklamasi) updateData.galeriAciklamasi = galeriAciklamasi;

    if (req.files && req.files['resim'] && req.files['resim'][0]) {
      if (existingGaleri.galeriResim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingGaleri.galeriResim);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }
      updateData.galeriResim = req.files['resim'][0].filename;
    }

    if (req.files && req.files['detay_resimler']) {
      let currentDetails = [];
      try {
        currentDetails = JSON.parse(existingGaleri.galeriDetayResimler || '[]');
      } catch (e) { currentDetails = []; }

      const newDetails = req.files['detay_resimler'].map(f => f.filename);
      const combinedDetails = [...currentDetails, ...newDetails];

      updateData.galeriDetayResimler = JSON.stringify(combinedDetails);
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

    await galeriService.deleteGaleri(id);

    if (galeri.galeriResim) {
      const filePath = path.join(__dirname, '../../public/images', galeri.galeriResim);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    if (galeri.galeriDetayResimler) {
      try {
        const details = JSON.parse(galeri.galeriDetayResimler);
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

const deleteGaleriDetailImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { filename } = req.body;

    const galeri = await galeriService.getGaleriDataById(id);
    if (!galeri) return res.status(404).json({ message: 'Kayıt bulunamadı.' });

    let details = [];
    try {
      details = JSON.parse(galeri.galeriDetayResimler || '[]');
    } catch (e) { details = []; }

    if (!details.includes(filename)) {
      return res.status(404).json({ message: 'Resim bulunamadı.' });
    }

    const newDetails = details.filter(f => f !== filename);

    await galeriService.updateGaleri(id, {
      galeriDetayResimler: JSON.stringify(newDetails)
    });

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