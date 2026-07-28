const authService = require('../../services/authService');
const { validateRegisterInput, validateLoginInput } = require('../../validators');
const { UnauthorizedError } = require('../../errors');

const authResolvers = {
  Mutation: {
    register: async (_, { email, password }) => {
      validateRegisterInput(email, password);
      const result = await authService.register(email, password);
      return result;
    },

    login: async (_, { email, password }) => {
      validateLoginInput(email, password);
      const result = await authService.login(email, password);
      return result;
    },
  },

  Query: {
    me: async (_, __, { user }) => {
      if (!user) {
        throw new UnauthorizedError('Unauthorized');
      }
      return authService.getCurrentUser(user.userId);
    },
  },
};

module.exports = authResolvers;
