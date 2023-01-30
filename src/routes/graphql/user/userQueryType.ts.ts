import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from 'graphql';
import { profileQueryType } from '../profile/profileQueryType';
import { memberQueryType } from '../memberType/memberQueryType';
import { postQueryType } from '../posts/postQueryType';
// @ts-ignore
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
    memberType: {
      type: memberQueryType,
      resolve: async (user: any, args: any, fastify: any) => {
        const profile = await fastify.db.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
        if (profile === null) {
          return Promise.resolve(null);
        }
        return await fastify.db.memberTypes.findOne({
          key: 'id',
          equals: profile.memberTypeId,
        });
      },
    },
    posts: {
      type: new GraphQLList(postQueryType),
      resolve: async (user: any, args: any, fastify: any) => {
        return await fastify.db.posts.findMany({
          key: 'userId',
          equals: user.id,
        });
      },
    },
    userSubscribedTo: {
      // @ts-ignore - Не понял как тут правильно затипизировать
      type: new GraphQLList(userQueryType),
      resolve: async (user: any, args: any, fastify: any) => {
        const usersBySubscribedToUserIds =
          fastify.loaders.usersBySubscribedToUserIds;
        return await usersBySubscribedToUserIds.load(user.id);
      },
    },
    subscribedToUser: {
      // @ts-ignore - Не понял как тут правильно затипизировать
      type: new GraphQLList(userQueryType),
      resolve: async (user: any, args: any, fastify: any) => {
        const userById = fastify.loaders.userById;

        return await userById.loadMany(user.subscribedToUserIds);
      },
    },
  },
});
