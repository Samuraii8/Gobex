'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tbl_Iletisim', {
            İD: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Ad_Soyad: {
                type: Sequelize.STRING,
                allowNull: false
            },
            E_posta: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Konu: {
                type: Sequelize.STRING,
                allowNull: false
            },
            Mesaj: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Tbl_Iletisim');
    }
};
