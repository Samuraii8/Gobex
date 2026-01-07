'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tbl_Hizmetler', {
      İD: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Hizmet_adı: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Hizmet_açıklaması: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      Hizmet_Kategorisi: {
        type: Sequelize.STRING,
        allowNull: true
      },
      Hizmet_resim: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tbl_Hizmetler');
  }
};