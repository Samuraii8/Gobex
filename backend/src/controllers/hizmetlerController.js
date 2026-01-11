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
    const { hizmetAdi, hizmetAciklamasi, hizmetKategorisi } = req.body;

    let hizmetResim = null;
    if (req.file) {
      hizmetResim = req.file.filename;
    }

    const data = await hizmetlerService.createHizmet({
      hizmetAdi,
      hizmetAciklamasi,
      hizmetKategorisi,
      hizmetResim
    });

    res.status(201).json(data);
  } catch (error) {
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
    const { hizmetAdi, hizmetAciklamasi, hizmetKategorisi } = req.body;

    const existingHizmet = await hizmetlerService.getHizmetById(id);
    if (!existingHizmet) {
      if (req.file) {
        const filePath = path.join(__dirname, '../../public/images', req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    const updateData = {};

    if (hizmetAdi) updateData.hizmetAdi = hizmetAdi;
    if (hizmetAciklamasi) updateData.hizmetAciklamasi = hizmetAciklamasi;
    if (hizmetKategorisi) updateData.hizmetKategorisi = hizmetKategorisi;

    if (req.file) {
      if (existingHizmet.hizmetResim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingHizmet.hizmetResim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.hizmetResim = req.file.filename;
    }

    const updatedData = await hizmetlerService.updateHizmet(id, updateData);
    res.status(200).json(updatedData);
  } catch (error) {
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

    const hizmet = await hizmetlerService.getHizmetById(id);
    if (!hizmet) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    await hizmetlerService.deleteHizmet(id);

    if (hizmet.hizmetResim) {
      const filePath = path.join(__dirname, '../../public/images', hizmet.hizmetResim);
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