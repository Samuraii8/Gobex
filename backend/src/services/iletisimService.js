const prisma = require('../utils/prismaClient');

const getAllIletisim = async () => {
    return await prisma.iletisim.findMany({
        orderBy: { createdAt: 'desc' }
    });
};

const getIletisimById = async (id) => {
    return await prisma.iletisim.findUnique({
        where: { id: parseInt(id) }
    });
};

const createIletisim = async (data) => {
    return await prisma.iletisim.create({
        data: data
    });
};

const deleteIletisim = async (id) => {
    try {
        return await prisma.iletisim.delete({
            where: { id: parseInt(id) }
        });
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
};

// Toplu silme (admin için)
const deleteMultipleIletisim = async (ids) => {
    const result = await prisma.iletisim.deleteMany({
        where: {
            id: {
                in: ids.map(id => parseInt(id))
            }
        }
    });
    return result.count;
};

module.exports = {
    getAllIletisim,
    getIletisimById,
    createIletisim,
    deleteIletisim,
    deleteMultipleIletisim,
};
