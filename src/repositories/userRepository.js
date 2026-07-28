const prisma = require('../utils/prisma');

async function findByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, createdAt: true, updatedAt: true },
  });
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
}

async function create(email, hashedPassword) {
  return prisma.user.create({
    data: { email, password: hashedPassword },
    select: { id: true, email: true, createdAt: true, updatedAt: true },
  });
}

module.exports = { findByEmail, findById, create };
