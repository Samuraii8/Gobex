'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Galeri extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Galeri.init({
    İD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Galeri_başlık: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Galeri_resim: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Galeri_Detay_Resimler: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Galeri_açıklaması: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Galeri',
    tableName: 'Tbl_Galeri',
    timestamps: false
  });
  return Galeri;
};