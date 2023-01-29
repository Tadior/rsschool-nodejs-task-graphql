import { GraphQLString } from 'graphql';
import { profileQueryType } from './profileQueryType';

export const profileQuery = {
  type: profileQueryType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.profiles.findOne({ key: 'id', equals: args.id });
  },
};
