const prisma = require('../utils/prisma');

async function findByShortCode(shortCode) {
  return prisma.url.findUnique({
    where: { shortCode },
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      clicks: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
}

async function findById(id) {
  return prisma.url.findUnique({
    where: { id },
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      clicks: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
}

async function findByUserId(userId, page, limit) {
  const skip = (page - 1) * limit;
  const [items, totalItems] = await Promise.all([
    prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        originalUrl: true,
        shortCode: true,
        clicks: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    }),
    prisma.url.count({ where: { userId } }),
  ]);
  return {
    items,
    totalItems,
    totalPages: Math.ceil(totalItems / limit) || 1,
    currentPage: page,
  };
}

async function create(data) {
  return prisma.url.create({
    data,
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      clicks: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
}

async function update(id, data) {
  return prisma.url.update({
    where: { id },
    data,
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      clicks: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
    },
  });
}

async function incrementClicks(id) {
  return prisma.url.update({
    where: { id },
    data: { clicks: { increment: 1 } },
    select: { originalUrl: true },
  });
}

async function remove(id) {
  return prisma.url.delete({ where: { id } });
}

module.exports = { findByShortCode, findById, findByUserId, create, update, incrementClicks, remove };
