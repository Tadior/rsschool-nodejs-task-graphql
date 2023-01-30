import { GraphQLID, GraphQLObjectType, GraphQLString } from 'graphql';

export const postQueryType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLString },
  },
});
