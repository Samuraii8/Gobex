const galeriService = require('../services/galeriService');

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
    const data = await galeriService.createGaleri(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateGaleri = async (req, res) => {
  try {
    const updatedData = await galeriService.updateGaleri(req.params.id, req.body);
    if (!updatedData) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteGaleri = async (req, res) => {
  try {
    const deleted = await galeriService.deleteGaleri(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
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