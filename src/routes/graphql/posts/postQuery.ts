import { GraphQLString } from 'graphql';
import { postQueryType } from './postQueryType';

const postQuery = {
  type: postQueryType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.posts.findOne({ key: 'id', equals: args.id });
  },
};

export { postQuery };
