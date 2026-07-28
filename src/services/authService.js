const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { ConflictError, UnauthorizedError } = require('../errors');

async function register(email, password) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ConflictError('Email already exists');
  }

  const hashed = await hashPassword(password);
  const user = await userRepository.create(email, hashed);
  const token = signToken({ userId: user.id });

  return { token, user };
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = signToken({ userId: user.id });

  return {
    token,
    user: { id: user.id, email: user.email, createdAt: user.createdAt, updatedAt: user.updatedAt },
  };
}

async function getCurrentUser(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new UnauthorizedError('User not found');
  }
  return user;
}

module.exports = { register, login, getCurrentUser };
