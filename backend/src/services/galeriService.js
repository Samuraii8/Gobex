const { Galeri } = require('../models');

const getAllGaleriData = async () => {
  return await Galeri.findAll({
    attributes: ['id', 'galeriBaslik', 'galeriResim', 'galeriDetayResimler']
  });
};

const getGaleriDataById = async (id) => {
  return await Galeri.findByPk(id);
};

const createGaleri = async (data) => {
  return await Galeri.create(data);
};

const updateGaleri = async (id, data) => {
  const galeri = await Galeri.findByPk(id);
  if (!galeri) return null;
  return await galeri.update(data);
};

const deleteGaleri = async (id) => {
  const galeri = await Galeri.findByPk(id);
  if (!galeri) return null;
  return await galeri.destroy();
};

module.exports = {
  getAllGaleriData,
  getGaleriDataById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
};