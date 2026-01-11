"use strict";
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Slider extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Slider.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sliderAd: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sliderResim: {
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
