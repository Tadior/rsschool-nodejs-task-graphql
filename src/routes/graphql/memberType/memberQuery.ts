import { GraphQLString } from 'graphql';
import { memberQueryType } from './memberQueryType';

export const memberQuery = {
  type: memberQueryType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.memberTypes.findOne({ key: 'id', equals: args.id });
  },
};
