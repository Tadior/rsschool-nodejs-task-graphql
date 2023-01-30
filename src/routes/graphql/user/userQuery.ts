import { userQueryType } from './userQueryType.ts';
import { GraphQLString } from 'graphql';

export const userQuery = {
  type: userQueryType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.users.findOne({ key: 'id', equals: args.id });
  },
};
