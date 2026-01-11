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
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true //true kalmalı burası!!!
    },
    baslik: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icerik: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    resim: {
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