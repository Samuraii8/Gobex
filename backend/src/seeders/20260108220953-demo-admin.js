'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    await queryInterface.bulkInsert('Tbl_Admin', [{
      Ad: 'admin',
      Şifre: hashedPassword
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tbl_Admin', null, {});
  }
};