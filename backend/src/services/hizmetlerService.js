const { Hizmetler } = require('../models');

const getAllHizmetlerData = async () => {
  return await Hizmetler.findAll();
};

const getHizmetById = async (id) => {
  return await Hizmetler.findByPk(id);
};

const createHizmet = async (data) => {
  return await Hizmetler.create(data);
};

const updateHizmet = async (id, data) => {
  const hizmet = await Hizmetler.findByPk(id);
  if (!hizmet) return null;
  return await hizmet.update(data);
};

const deleteHizmet = async (id) => {
  const hizmet = await Hizmetler.findByPk(id);
  if (!hizmet) return null;
  return await hizmet.destroy();
};

module.exports = {
  getAllHizmetlerData,
  getHizmetById,
  createHizmet,
  updateHizmet,
  deleteHizmet,
};