const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./graphql/schema');
const { createContext } = require('./context');
const redirectRouter = require('./routes/redirect');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', redirectRouter);

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: createContext,
    formatError: (formattedError) => {
      const { message } = formattedError;
      return { message };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  return app;
}

module.exports = { app, startApolloServer };
