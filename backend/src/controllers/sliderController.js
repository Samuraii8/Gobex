const sliderService = require('../services/sliderService');

const getAllSlider = async (req, res) => {
  try {
    const data = await sliderService.getAllSliderData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sliderService.getSliderDataById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Slider öğesi bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlider = async (req, res) => {
  try {
    const data = await sliderService.createSlider(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSlider = async (req, res) => {
  try {
    const updatedData = await sliderService.updateSlider(req.params.id, req.body);
    if (!updatedData) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSlider = async (req, res) => {
  try {
    const deleted = await sliderService.deleteSlider(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSlider,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};
