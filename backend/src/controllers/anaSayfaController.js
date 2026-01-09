const anaSayfaService = require('../services/anaSayfaService');

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
    const data = await anaSayfaService.createAnaSayfa(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnaSayfa = async (req, res) => {
  try {
    const updatedData = await anaSayfaService.updateAnaSayfa(req.params.id, req.body);
    if (!updatedData) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAnaSayfa = async (req, res) => {
  try {
    const deleted = await anaSayfaService.deleteAnaSayfa(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
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