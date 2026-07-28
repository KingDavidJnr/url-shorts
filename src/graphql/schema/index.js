const { makeExecutableSchema } = require('@graphql-tools/schema');
const typeDefs = require('../types/typeDefs');
const resolvers = require('../resolvers');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
