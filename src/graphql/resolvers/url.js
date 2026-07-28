const urlService = require('../../services/urlService');
const { validateCreateUrlInput, validateUpdateUrlInput } = require('../../validators');
const { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } = require('../../constants');

const urlResolvers = {
  Mutation: {
    createShortUrl: async (_, { originalUrl, shortCode, expiresAt }, { user }) => {
      validateCreateUrlInput(originalUrl, shortCode, expiresAt);
      const userId = user ? user.userId : null;
      return urlService.createShortUrl(originalUrl, shortCode, expiresAt, userId);
    },

    updateUrl: async (_, { id, originalUrl, expiresAt }, { user }) => {
      if (!user) {
        const { UnauthorizedError } = require('../../errors');
        throw new UnauthorizedError('Unauthorized');
      }
      validateUpdateUrlInput(originalUrl, expiresAt);
      return urlService.updateUrl(id, user.userId, { originalUrl, expiresAt });
    },

    deleteUrl: async (_, { id }, { user }) => {
      if (!user) {
        const { UnauthorizedError } = require('../../errors');
        throw new UnauthorizedError('Unauthorized');
      }
      return urlService.deleteUrl(id, user.userId);
    },
  },

  Query: {
    myUrls: async (_, { page, limit }, { user }) => {
      if (!user) {
        const { UnauthorizedError } = require('../../errors');
        throw new UnauthorizedError('Unauthorized');
      }
      const currentPage = Math.max(page || DEFAULT_PAGE, 1);
      const currentLimit = Math.min(Math.max(limit || DEFAULT_LIMIT, 1), MAX_LIMIT);
      return urlService.getUserUrls(user.userId, currentPage, currentLimit);
    },

    url: async (_, { id }, { user }) => {
      if (!user) {
        const { UnauthorizedError } = require('../../errors');
        throw new UnauthorizedError('Unauthorized');
      }
      return urlService.getUrlById(id, user.userId);
    },

    analytics: async (_, { id }, { user }) => {
      if (!user) {
        const { UnauthorizedError } = require('../../errors');
        throw new UnauthorizedError('Unauthorized');
      }
      return urlService.getAnalytics(id, user.userId);
    },
  },
};

module.exports = urlResolvers;
