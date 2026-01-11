'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Iletisim extends Model {
        static associate(models) {
            // define association here if needed
        }
    }

    Iletisim.init({
        İD: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Ad_Soyad: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Ad Soyad alanı boş bırakılamaz.' },
                len: { args: [2, 100], msg: 'Ad Soyad 2-100 karakter arasında olmalıdır.' }
            }
        },
        E_posta: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'E-posta alanı boş bırakılamaz.' },
                isEmail: { msg: 'Geçerli bir e-posta adresi giriniz.' }
            }
        },
        Konu: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Konu alanı boş bırakılamaz.' },
                len: { args: [3, 200], msg: 'Konu 3-200 karakter arasında olmalıdır.' }
            }
        },
        Mesaj: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Mesaj alanı boş bırakılamaz.' },
                len: { args: [10, 5000], msg: 'Mesaj 10-5000 karakter arasında olmalıdır.' }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Iletisim',
        tableName: 'Tbl_Iletisim',
        timestamps: false
    });

    return Iletisim;
};
