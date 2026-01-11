'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Tbl_Iletisim', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            adSoyad: {
                type: Sequelize.STRING,
                allowNull: false
            },
            ePosta: {
                type: Sequelize.STRING,
                allowNull: false
            },
            konu: {
                type: Sequelize.STRING,
                allowNull: false
            },
            mesaj: {
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
