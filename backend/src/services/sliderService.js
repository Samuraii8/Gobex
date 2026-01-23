const prisma = require('../utils/prismaClient');

const getAllSliderData = async () => {
  return await prisma.slider.findMany({
    select: {
      id: true,
      sliderAd: true,
      sliderResim: true
    }
  });
};

const getSliderDataById = async (id) => {
  return await prisma.slider.findUnique({
    where: { id: parseInt(id) }
  });
};

const createSlider = async (data) => {
  return await prisma.slider.create({
    data: data
  });
};

const updateSlider = async (id, data) => {
  try {
    return await prisma.slider.update({
      where: { id: parseInt(id) },
      data: data
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

const deleteSlider = async (id) => {
  try {
    return await prisma.slider.delete({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

module.exports = {
  getAllSliderData,
  getSliderDataById,
  createSlider,
  updateSlider,
  deleteSlider,
};
