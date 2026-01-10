"use strict";
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slider extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Slider.init({
    İD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Slider_ad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Slider_resim: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Slider',
    tableName: 'Tbl_Slider',
    timestamps: false
  });
  return Slider;
};
