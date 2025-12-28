'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_Galeri', {
      İD: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Galeri_başlık: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Galeri_resim: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Galeri_açıklaması: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_Galeri');
  }
};