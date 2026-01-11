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
    const { baslik, icerik } = req.body;

    let resim = null;
    if (req.file) {
      resim = req.file.filename;
    }

    const data = await anaSayfaService.createAnaSayfa({
      baslik,
      icerik,
      resim
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

const updateAnaSayfa = async (req, res) => {
  try {
    const { id } = req.params;
    const { baslik, icerik } = req.body;

    const existingData = await anaSayfaService.getAnaSayfaById(id);
    if (!existingData) {
      if (req.file) {
        const filePath = path.join(__dirname, '../../public/images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    const updateData = {};

    if (baslik) updateData.baslik = baslik;
    if (icerik) updateData.icerik = icerik;

    if (req.file) {
      if (existingData.resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingData.resim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.resim = req.file.filename;
    }

    const updatedData = await anaSayfaService.updateAnaSayfa(id, updateData);
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

const deleteAnaSayfa = async (req, res) => {
  try {
    const { id } = req.params;

    const anaSayfa = await anaSayfaService.getAnaSayfaById(id);
    if (!anaSayfa) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    await anaSayfaService.deleteAnaSayfa(id);

    if (anaSayfa.resim) {
      const filePath = path.join(__dirname, '../../public/images', anaSayfa.resim);
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