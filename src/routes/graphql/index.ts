import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql';
import { userQuery } from './user/userQuery';
import { usersQuery } from './user/usersQuery';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: usersQuery,
    user: userQuery,
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
