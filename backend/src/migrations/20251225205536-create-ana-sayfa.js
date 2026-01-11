'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_AnaSayfa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      baslik: {
        type: Sequelize.STRING,
        allowNull: false
      },
      icerik: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      resim: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_AnaSayfa');
  }
};