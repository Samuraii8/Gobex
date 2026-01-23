const sliderService = require('../services/sliderService');
const path = require('path');
const fs = require('fs');

const getAllSlider = async (req, res) => {
  try {
    const data = await sliderService.getAllSliderData();
    res.status(200).json(data);
  } catch (error) {
    console.error('GetAllSlider Error:', error);
    res.status(500).json({ message: 'Slider listesi getirilirken bir hata oluştu.' });
  }
};

const getSliderById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sliderService.getSliderDataById(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Slider öğesi bulunamadı.' });
    }
  } catch (error) {
    console.error('GetSliderById Error:', error);
    res.status(500).json({ message: 'Slider detayı getirilirken bir hata oluştu.' });
  }
};

const createSlider = async (req, res) => {
  try {
    const { sliderAd } = req.body;

    let sliderResim = null;
    if (req.file) {
      sliderResim = req.file.filename;
    }

    const data = await sliderService.createSlider({
      sliderAd,
      sliderResim
    });

    res.status(201).json(data);
  } catch (error) {
    // Hata durumunda yüklenen dosyayı sil
    if (req.file) {
      const filePath = path.join(__dirname, '../../public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    console.error('CreateSlider Error:', error);
    res.status(500).json({ message: 'Slider oluşturulurken bir hata oluştu.' });
  }
};

const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { sliderAd } = req.body;

    // Mevcut slider'ı al
    const existingSlider = await sliderService.getSliderDataById(id);
    if (!existingSlider) {
      // Yüklenen dosyayı sil (varsa)
      if (req.file) {
        const filePath = path.join(__dirname, '../../public/images', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    const updateData = {};

    if (sliderAd) {
      updateData.sliderAd = sliderAd;
    }

    // Yeni dosya yüklendiyse
    if (req.file) {
      // Eski dosyayı sil
      if (existingSlider.sliderResim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingSlider.sliderResim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.sliderResim = req.file.filename;
    }

    const updatedData = await sliderService.updateSlider(id, updateData);
    res.status(200).json(updatedData);
  } catch (error) {
    // Hata durumunda yüklenen dosyayı sil
    if (req.file) {
      const filePath = path.join(__dirname, '../../public/images', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    console.error('UpdateSlider Error:', error);
    res.status(500).json({ message: 'Slider güncellenirken bir hata oluştu.' });
  }
};

const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    // Slider'ı al
    const slider = await sliderService.getSliderDataById(id);
    if (!slider) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Slider'ı sil
    await sliderService.deleteSlider(id);

    // Resim dosyasını sil
    if (slider.sliderResim) {
      const filePath = path.join(__dirname, '../../public/images', slider.sliderResim);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(204).send();
  } catch (error) {
    console.error('DeleteSlider Error:', error);
    res.status(500).json({ message: 'Slider silinirken bir hata oluştu.' });
  }
};

module.exports = {
  getAllSlider,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};
