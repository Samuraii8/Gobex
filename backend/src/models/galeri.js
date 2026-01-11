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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    galeriBaslik: {
      type: DataTypes.STRING,
      allowNull: false
    },
    galeriResim: {
      type: DataTypes.STRING,
      allowNull: true
    },
    galeriDetayResimler: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    galeriAciklamasi: {
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