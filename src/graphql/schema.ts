import { makeSchema } from 'nexus';
import { join } from 'path';
import * as types from './types';
import * as resolvers from './resolvers';

export const schema = makeSchema({
  types: { ...types, ...resolvers },
  outputs: {
    typegen: join(__dirname, 'nexus-typegen.ts'),
    schema: join(__dirname, 'schema.graphql'),
  },
  contextType: {
    module: require.resolve('../auth/middleware'),
    export: 'Context',
  },
});