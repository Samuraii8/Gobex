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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    hizmetAdi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hizmetAciklamasi: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hizmetKategorisi: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hizmetResim: {
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