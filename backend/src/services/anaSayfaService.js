const { AnaSayfa } = require('../models');

const getAnaSayfaData = async () => {
  return await AnaSayfa.findAll();
};

const getAnaSayfaById = async (id) => {
  return await AnaSayfa.findByPk(id);
};

const createAnaSayfa = async (data) => {
  return await AnaSayfa.create(data);
};

const updateAnaSayfa = async (id, data) => {
  const anaSayfa = await AnaSayfa.findByPk(id);
  if (!anaSayfa) return null;
  return await anaSayfa.update(data);
};

const deleteAnaSayfa = async (id) => {
  const anaSayfa = await AnaSayfa.findByPk(id);
  if (!anaSayfa) return null;
  return await anaSayfa.destroy();
};

module.exports = {
  getAnaSayfaData,
  getAnaSayfaById,
  createAnaSayfa,
  updateAnaSayfa,
  deleteAnaSayfa,
};