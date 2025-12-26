'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnaSayfa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AnaSayfa.init({
    İD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Başlık: {
      type: DataTypes.STRING,
      allowNull: false
    },
    İçerik: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    Resim: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AnaSayfa',
    tableName: 'Tbl_AnaSayfa',
    timestamps: false
  });
  return AnaSayfa;
};