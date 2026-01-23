const prisma = require('../utils/prismaClient');

const getAllAnaSayfaData = async () => {
  return await prisma.anaSayfa.findMany();
};

const getAnaSayfaById = async (id) => {
  return await prisma.anaSayfa.findUnique({
    where: { id: parseInt(id) }
  });
};

const createAnaSayfa = async (data) => {
  return await prisma.anaSayfa.create({
    data: data
  });
};

const updateAnaSayfa = async (id, data) => {
  try {
    return await prisma.anaSayfa.update({
      where: { id: parseInt(id) },
      data: data
    });
  } catch (error) {
    if (error.code === 'P2025') return null; // Record not found
    throw error;
  }
};

const deleteAnaSayfa = async (id) => {
  try {
    return await prisma.anaSayfa.delete({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

module.exports = {
  getAnaSayfaData: getAllAnaSayfaData, // Export alias to match controller usage if needed
  getAllAnaSayfaData,
  getAnaSayfaById,
  createAnaSayfa,
  updateAnaSayfa,
  deleteAnaSayfa,
};