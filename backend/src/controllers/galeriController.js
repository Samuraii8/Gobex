const galeriService = require('../services/galeriService');

const getAllGaleri = async (req, res) => {
  try {
    const data = await galeriService.getAllGaleriData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGaleriById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await galeriService.getGaleriDataById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Galeri öğesi bulunamadı.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllGaleri,
  getGaleriById,
};
