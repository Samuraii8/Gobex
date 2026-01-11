'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_Galeri', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      galeriBaslik: {
        type: Sequelize.STRING,
        allowNull: false
      },
      galeriResim: {
        type: Sequelize.STRING,
        allowNull: true
      },
      galeriAciklamasi: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_Galeri');
  }
};