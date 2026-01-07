'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hizmetler extends Model {
    static associate(models) {
      // define association here
    }
  }
  Hizmetler.init({
    İD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Hizmet_adı: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Hizmet_açıklaması: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Hizmet_Kategorisi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Hizmet_resim: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Hizmetler',
    tableName: 'Tbl_Hizmetler',
    timestamps: false
  });
  return Hizmetler;
};