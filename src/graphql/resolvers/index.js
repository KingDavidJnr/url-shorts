const authResolvers = require('./auth');
const urlResolvers = require('./url');

function mergeResolvers(...resolverList) {
  const merged = { Query: {}, Mutation: {} };
  for (const r of resolverList) {
    Object.assign(merged.Query, r.Query);
    Object.assign(merged.Mutation, r.Mutation);
  }
  return merged;
}

const resolvers = mergeResolvers(authResolvers, urlResolvers);

module.exports = resolvers;
