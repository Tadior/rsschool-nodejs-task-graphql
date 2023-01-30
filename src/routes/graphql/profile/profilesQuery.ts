import { GraphQLList } from 'graphql';
import { profileQueryType } from './profileQueryType';

export const profilesQuery = {
  type: new GraphQLList(profileQueryType),
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.profiles.findMany();
  },
};
