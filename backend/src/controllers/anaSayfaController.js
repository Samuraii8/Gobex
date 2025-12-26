const anaSayfaService = require('../services/anaSayfaService');

const getAllAnaSayfaData = async (req, res) => {
  try {
    const data = await anaSayfaService.getAnaSayfaData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAnaSayfaData,
};
