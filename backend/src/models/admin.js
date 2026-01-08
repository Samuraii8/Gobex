'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // define association here
    }
  }
  Admin.init({
    İD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Ad: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Şifre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Admin',
    tableName: 'Tbl_Admin',
    timestamps: false
  });
  return Admin;
};