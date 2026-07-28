const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: '7d',
  databaseUrl: process.env.DATABASE_URL,
};
