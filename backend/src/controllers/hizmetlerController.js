const hizmetlerService = require('../services/hizmetlerService');

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
    const data = await hizmetlerService.createHizmet(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateHizmet = async (req, res) => {
  try {
    const updatedData = await hizmetlerService.updateHizmet(req.params.id, req.body);
    if (!updatedData) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteHizmet = async (req, res) => {
  try {
    const deleted = await hizmetlerService.deleteHizmet(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
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