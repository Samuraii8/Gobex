const sliderService = require('../services/sliderService');
const path = require('path');
const fs = require('fs');

const getAllSlider = async (req, res) => {
  try {
    const data = await sliderService.getAllSliderData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

const createSlider = async (req, res) => {
  try {
    const { Slider_ad } = req.body;

    // 1. Durum: Dosya direkt yüklendiyse (Multipart)
    let Slider_resim = null;
    if (req.file) {
      // Sadece dosya adını kaydet (public/images içinde olduğu için)
      Slider_resim = req.file.filename;
    }
    // 2. Durum: Dosya daha önce yüklendiyse ve path gönderildiyse (JSON Body)
    else if (req.body.Slider_resim) {
      // Gelen path '/images/dosya.jpg' formatındaysa sadece dosya adını al
      Slider_resim = path.basename(req.body.Slider_resim);
    }

    const data = await sliderService.createSlider({
      Slider_ad,
      Slider_resim
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
    res.status(500).json({ message: error.message });
  }
};

const updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { Slider_ad } = req.body;

    // Mevcut slider'ı al (eski resmi silmek için)
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

    // Slider_ad varsa güncelle
    if (Slider_ad) {
      updateData.Slider_ad = Slider_ad;
    }

    // 1. Durum: Yeni dosya direkt yüklendiyse
    if (req.file) {
      // Eski dosyayı sil
      if (existingSlider.Slider_resim) {
        const oldFilePath = path.join(__dirname, '../../public/images', existingSlider.Slider_resim);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.Slider_resim = req.file.filename;
    }
    // 2. Durum: Yeni dosya path'i string olarak geldiyse
    else if (req.body.Slider_resim) {
      const newFileName = path.basename(req.body.Slider_resim);
      // Eğer dosya adı değiştiyse eskiyi sil ve yeniyi kaydet
      if (existingSlider.Slider_resim !== newFileName) {
        if (existingSlider.Slider_resim) {
          const oldFilePath = path.join(__dirname, '../../public/images', existingSlider.Slider_resim);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updateData.Slider_resim = newFileName;
      }
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
    res.status(500).json({ message: error.message });
  }
};

const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    // Slider'ı al (resmi silmek için)
    const slider = await sliderService.getSliderDataById(id);
    if (!slider) {
      return res.status(404).json({ message: 'Kayıt bulunamadı.' });
    }

    // Slider'ı sil
    const deleted = await sliderService.deleteSlider(id);

    // Resim dosyasını sil
    if (slider.Slider_resim) {
      const filePath = path.join(__dirname, '../../public/images', slider.Slider_resim);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSlider,
  getSliderById,
  createSlider,
  updateSlider,
  deleteSlider,
};

