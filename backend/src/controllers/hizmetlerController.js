const hizmetlerService = require('../services/hizmetlerService');

const getAllHizmetler = async (req, res) => {
  try {
    const data = await hizmetlerService.getAllHizmetlerData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllHizmetler,
};
