'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_AnaSayfa', {
      İD: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Başlık: {
        type: Sequelize.STRING,
        allowNull: false
      },
      İçerik: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Resim: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_AnaSayfa');
  }
};