const { Hizmetler } = require('../models');

const getAllHizmetlerData = async () => {
  return await Hizmetler.findAll();
};

module.exports = {
  getAllHizmetlerData,
};
