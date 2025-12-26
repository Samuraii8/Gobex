const { AnaSayfa } = require('../models');

const getAnaSayfaData = async () => {
  return await AnaSayfa.findAll();
};

module.exports = {
  getAnaSayfaData,
};
