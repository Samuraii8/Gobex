const { Galeri } = require('../models');

const getAllGaleriData = async () => {
  return await Galeri.findAll({
    attributes: ['İD', 'Galeri_başlık', 'Galeri_resim']
  });
};

const getGaleriDataById = async (id) => {
  return await Galeri.findByPk(id);
}

module.exports = {
  getAllGaleriData,
  getGaleriDataById
};
