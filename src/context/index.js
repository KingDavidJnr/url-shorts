const { verifyToken } = require('../utils/jwt');

function createContext({ req }) {
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');

  let user = null;
  if (token) {
    try {
      user = verifyToken(token);
    } catch {
      user = null;
    }
  }

  return { user };
}

module.exports = { createContext };
