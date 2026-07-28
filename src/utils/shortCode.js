const crypto = require('crypto');
const { SHORT_CODE_CHARS, SHORT_CODE_LENGTH_MIN, SHORT_CODE_LENGTH_MAX } = require('../constants');

function generateShortCode() {
  const length = SHORT_CODE_LENGTH_MIN + Math.floor(Math.random() * (SHORT_CODE_LENGTH_MAX - SHORT_CODE_LENGTH_MIN + 1));
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += SHORT_CODE_CHARS[bytes[i] % SHORT_CODE_CHARS.length];
  }
  return code;
}

module.exports = { generateShortCode };
