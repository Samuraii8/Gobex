const { Iletisim } = require('../models');

const getAllIletisim = async () => {
    return await Iletisim.findAll({
        order: [['createdAt', 'DESC']] // En yeni mesajlar önce
    });
};

const getIletisimById = async (id) => {
    return await Iletisim.findByPk(id);
};

const createIletisim = async (data) => {
    return await Iletisim.create(data);
};

const deleteIletisim = async (id) => {
    const iletisim = await Iletisim.findByPk(id);
    if (!iletisim) return null;
    return await iletisim.destroy();
};

// Toplu silme (admin için)
const deleteMultipleIletisim = async (ids) => {
    return await Iletisim.destroy({
        where: { id: ids }
    });
};

module.exports = {
    getAllIletisim,
    getIletisimById,
    createIletisim,
    deleteIletisim,
    deleteMultipleIletisim,
};
