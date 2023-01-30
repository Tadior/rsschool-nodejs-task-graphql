import { GraphQLList } from 'graphql';
import { postQueryType } from './postQueryType';

export const postsQuery = {
  type: new GraphQLList(postQueryType),
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.posts.findMany();
  },
};
