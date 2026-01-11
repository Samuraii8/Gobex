'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_Hizmetler', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hizmetAdi: {
        type: Sequelize.STRING,
        allowNull: false
      },
      hizmetAciklamasi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      hizmetKategorisi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hizmetResim: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_Hizmetler');
  }
};