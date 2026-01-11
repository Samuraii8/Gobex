'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Tbl_Galeri', 'Galeri_Detay_Resimler', {
            type: Sequelize.TEXT, // Uzun JSON string için TEXT kullanıyoruz
            allowNull: true,
            comment: 'JSON array of detail image filenames'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Tbl_Galeri', 'Galeri_Detay_Resimler');
    }
};
