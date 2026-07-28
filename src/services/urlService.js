const urlRepository = require('../repositories/urlRepository');
const { generateShortCode } = require('../utils/shortCode');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors');

async function createShortUrl(originalUrl, shortCode, expiresAt, userId) {
  let code = shortCode;

  if (code) {
    const existing = await urlRepository.findByShortCode(code);
    if (existing) {
      throw new BadRequestError('Short code already exists');
    }
  } else {
    let unique = false;
    while (!unique) {
      code = generateShortCode();
      const existing = await urlRepository.findByShortCode(code);
      if (!existing) unique = true;
    }
  }

  const url = await urlRepository.create({
    originalUrl,
    shortCode: code,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    userId: userId || null,
  });

  return url;
}

async function redirect(shortCode) {
  const url = await urlRepository.findByShortCode(shortCode);
  if (!url) {
    throw new NotFoundError('URL not found');
  }

  if (url.expiresAt && new Date(url.expiresAt) <= new Date()) {
    throw new NotFoundError('URL not found');
  }

  const result = await urlRepository.incrementClicks(url.id);
  return result.originalUrl;
}

async function getUserUrls(userId, page, limit) {
  return urlRepository.findByUserId(userId, page, limit);
}

async function getUrlById(id, userId) {
  const url = await urlRepository.findById(id);
  if (!url) {
    throw new NotFoundError('URL not found');
  }
  if (url.userId !== userId) {
    throw new ForbiddenError('Forbidden');
  }
  return url;
}

async function updateUrl(id, userId, data) {
  const url = await urlRepository.findById(id);
  if (!url) {
    throw new NotFoundError('URL not found');
  }
  if (url.userId !== userId) {
    throw new ForbiddenError('Forbidden');
  }

  const updateData = {};
  if (data.originalUrl) updateData.originalUrl = data.originalUrl;
  if (data.expiresAt !== undefined) {
    updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
  }

  return urlRepository.update(id, updateData);
}

async function deleteUrl(id, userId) {
  const url = await urlRepository.findById(id);
  if (!url) {
    throw new NotFoundError('URL not found');
  }
  if (url.userId !== userId) {
    throw new ForbiddenError('Forbidden');
  }

  await urlRepository.remove(id);
  return { message: 'URL deleted successfully' };
}

async function getAnalytics(id, userId) {
  const url = await urlRepository.findById(id);
  if (!url) {
    throw new NotFoundError('URL not found');
  }
  if (url.userId !== userId) {
    throw new ForbiddenError('Forbidden');
  }
  return url;
}

module.exports = { createShortUrl, redirect, getUserUrls, getUrlById, updateUrl, deleteUrl, getAnalytics };
