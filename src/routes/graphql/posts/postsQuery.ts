import { GraphQLList } from 'graphql';
import { postQueryType } from './PostQueryType';

const postsQuery = {
  type: new GraphQLList(postQueryType),
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.posts.findMany();
  },
};

export { postsQuery };
