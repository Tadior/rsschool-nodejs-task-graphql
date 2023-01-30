import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userQuery } from './user/userQuery';
import { usersQuery } from './user/usersQuery';
import { membersQuery } from './memberType/membersQuery';
import { memberQuery } from './memberType/memberQuery';
import { profileQuery } from './profile/profileQuery';
import { profilesQuery } from './profile/profilesQuery';
import { postQuery } from './posts/postQuery';
import { postsQuery } from './posts/postsQuery';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: usersQuery,
    user: userQuery,
    members: membersQuery,
    member: memberQuery,
    profiles: profilesQuery,
    profile: profileQuery,
    posts: postsQuery,
    post: postQuery,
  },
});

const schema = new GraphQLSchema({
  query: query,
});

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      return await graphql({
        schema,
        source: String(request.body.query),
        variableValues: request.body.variables,
        contextValue: fastify,
      });
    }
  );
};

export default plugin;
