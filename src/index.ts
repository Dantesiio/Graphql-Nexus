import { ApolloServer } from 'apollo-server';
import { schema } from './graphql/schema';
import { createContext } from './auth/middleware';

const server = new ApolloServer({
  schema,
  context: createContext,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor listo en ${url}`);
});