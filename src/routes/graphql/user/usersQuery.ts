import { GraphQLList } from 'graphql';
import { userQueryType } from './userQueryType.ts';

export const usersQuery = {
  type: new GraphQLList(userQueryType),
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.users.findMany();
  },
};
