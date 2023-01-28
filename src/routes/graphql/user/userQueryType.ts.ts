import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import { profileQueryType } from '../profile/profileQueryType';

export const userQueryType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLInt) },
    profile: {
      type: profileQueryType,
      resolve: async (user: any, args: any, fastify: any) => {
        return await fastify.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
      },
    },
  },
});
