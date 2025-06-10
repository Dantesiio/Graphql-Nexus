import { ApolloServer } from 'apollo-server';
import { schema } from './graphql/schema';
import { createContext } from './auth/middleware';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

const server = new ApolloServer({
  schema,
  context: createContext,
  introspection: true, // permite introspección en producción
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor listo en ${url}`);
});