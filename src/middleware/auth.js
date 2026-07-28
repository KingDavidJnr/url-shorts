const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.replace('Bearer ', '');

  if (token) {
    try {
      req.user = verifyToken(token);
    } catch {
      req.user = null;
    }
  }

  next();
}

module.exports = { authenticate };
