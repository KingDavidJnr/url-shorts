const config = require('./config');
const { startApolloServer } = require('./app');

async function main() {
  const app = await startApolloServer();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    console.log(`GraphQL endpoint: http://localhost:${config.port}/graphql`);
  });
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
