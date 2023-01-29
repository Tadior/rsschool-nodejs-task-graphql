import { GraphQLList } from 'graphql';
import { memberQueryType } from './memberQueryType';

export const membersQuery = {
  type: new GraphQLList(memberQueryType),
  resolve: async (_: any, args: any, fastify: any) => {
    return await fastify.db.memberTypes.findMany();
  },
};
