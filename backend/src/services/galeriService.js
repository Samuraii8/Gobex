const prisma = require('../utils/prismaClient');

const getAllGaleriData = async () => {
  return await prisma.galeri.findMany({
    select: {
      id: true,
      galeriBaslik: true,
      galeriResim: true,
      galeriDetayResimler: true
    }
  });
};

const getGaleriDataById = async (id) => {
  return await prisma.galeri.findUnique({
    where: { id: parseInt(id) }
  });
};

const createGaleri = async (data) => {
  return await prisma.galeri.create({
    data: data
  });
};

const updateGaleri = async (id, data) => {
  try {
    return await prisma.galeri.update({
      where: { id: parseInt(id) },
      data: data
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

const deleteGaleri = async (id) => {
  try {
    return await prisma.galeri.delete({
      where: { id: parseInt(id) }
    });
  } catch (error) {
    if (error.code === 'P2025') return null;
    throw error;
  }
};

module.exports = {
  getAllGaleriData,
  getGaleriDataById,
  createGaleri,
  updateGaleri,
  deleteGaleri,
};