const { PASSWORD_MIN_LENGTH, SHORT_CODE_LENGTH_MIN, SHORT_CODE_LENGTH_MAX } = require('../constants');
const { BadRequestError } = require('../errors');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;
const SHORT_CODE_REGEX = /^[A-Za-z0-9]+$/;

function validateEmail(email) {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new BadRequestError('Invalid email format');
  }
}

function validatePassword(password) {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    throw new BadRequestError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
}

function validateUrl(url) {
  if (!url || !URL_REGEX.test(url)) {
    throw new BadRequestError('Invalid URL format');
  }
}

function validateShortCode(shortCode) {
  if (!shortCode) return;
  if (
    shortCode.length < SHORT_CODE_LENGTH_MIN ||
    shortCode.length > SHORT_CODE_LENGTH_MAX ||
    !SHORT_CODE_REGEX.test(shortCode)
  ) {
    throw new BadRequestError(
      `Short code must be ${SHORT_CODE_LENGTH_MIN}-${SHORT_CODE_LENGTH_MAX} alphanumeric characters`
    );
  }
}

function validateExpiration(date) {
  if (!date) return;
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    throw new BadRequestError('Invalid expiration date');
  }
  if (parsed <= new Date()) {
    throw new BadRequestError('Expiration date cannot be in the past');
  }
}

function validateLoginInput(email, password) {
  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }
}

function validateRegisterInput(email, password) {
  validateEmail(email);
  validatePassword(password);
}

function validateCreateUrlInput(originalUrl, shortCode, expiresAt) {
  validateUrl(originalUrl);
  validateShortCode(shortCode);
  validateExpiration(expiresAt);
}

function validateUpdateUrlInput(originalUrl, expiresAt) {
  if (!originalUrl && !expiresAt) {
    throw new BadRequestError('Nothing to update');
  }
  if (originalUrl) validateUrl(originalUrl);
  if (expiresAt) validateExpiration(expiresAt);
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateCreateUrlInput,
  validateUpdateUrlInput,
  validateEmail,
  validatePassword,
  validateUrl,
  validateShortCode,
  validateExpiration,
};
