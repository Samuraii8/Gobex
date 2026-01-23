const prisma = require('../utils/prismaClient');

const getAllHizmetlerData = async () => {
  return await prisma.hizmetler.findMany();
};

const getHizmetById = async (id) => {
  return await prisma.hizmetler.findUnique({
    where: { id: parseInt(id) }
  });
};

const createHizmet = async (data) => {
  return await prisma.hizmetler.create({
    data: data
  });
};

const updateHizmet = async (id, data) => {
  try {
    return await prisma.hizmetler.update({
      where: { id: parseInt(id) },
      data: data
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

const deleteHizmet = async (id) => {
  try {
    return await prisma.hizmetler.delete({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

module.exports = {
  getAllHizmetlerData,
  getHizmetById,
  createHizmet,
  updateHizmet,
  deleteHizmet,
};