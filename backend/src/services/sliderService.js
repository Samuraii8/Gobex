const { Slider } = require('../models');

const getAllSliderData = async () => {
  return await Slider.findAll({
    attributes: ['id', 'sliderAd', 'sliderResim']
  });
};

const getSliderDataById = async (id) => {
  return await Slider.findByPk(id);
};

const createSlider = async (data) => {
  return await Slider.create(data);
};

const updateSlider = async (id, data) => {
  const slider = await Slider.findByPk(id);
  if (!slider) return null;
  return await slider.update(data);
};

const deleteSlider = async (id) => {
  const slider = await Slider.findByPk(id);
  if (!slider) return null;
  return await slider.destroy();
};

module.exports = {
  getAllSliderData,
  getSliderDataById,
  createSlider,
  updateSlider,
  deleteSlider,
};
