import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { validate as checkUuid } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });
      if (user === null) {
        throw fastify.httpErrors.notFound();
      }
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (checkUuid(request.params.id) === false) {
        throw fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (user === null) {
        throw fastify.httpErrors.notFound();
      }

      const subscribers = await fastify.db.users.findMany({
        key: 'subscribedToUserIds',
        inArray: request.params.id,
      });

      for (const subscriber of subscribers) {
        const index = subscriber.subscribedToUserIds.indexOf(request.params.id);

        if (index !== -1) {
          subscribers.splice(index, 1);
        }

        await fastify.db.users.change(subscriber.id, subscriber);
      }

      const posts = await fastify.db.posts.findMany({
        key: 'userId',
        equals: request.params.id,
      });

      for (const post of posts) {
        await fastify.db.posts.delete(post.id);
      }

      const subscriberProfiles = await fastify.db.profiles.findMany({
        key: 'userId',
        equals: request.params.id,
      });

      for (const profile of subscriberProfiles) {
        await fastify.db.profiles.delete(profile.id);
      }

      await fastify.db.users.delete(request.params.id);

      return user;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (user === null) {
        throw fastify.httpErrors.notFound();
      }

      const subscribedData = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (subscribedData === null) {
        throw fastify.httpErrors.notFound();
      }

      if (subscribedData.subscribedToUserIds.includes(request.params.id)) {
        throw fastify.httpErrors.badRequest();
      }

      subscribedData.subscribedToUserIds.push(request.params.id);

      await fastify.db.users.change(request.body.userId, subscribedData);

      return user;
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const unsubscribedData = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (unsubscribedData === null) {
        throw fastify.httpErrors.notFound();
      }

      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (user === null) {
        throw fastify.httpErrors.notFound();
      }

      if (user.subscribedToUserIds.includes(request.params.id) === false) {
        throw fastify.httpErrors.badRequest();
      }

      const index = user.subscribedToUserIds.indexOf(request.params.id);

      if (index !== -1) {
        user.subscribedToUserIds.splice(index, 1);
      }

      await fastify.db.users.change(request.body.userId, user);

      return user;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (checkUuid(request.params.id) === false) {
        throw fastify.httpErrors.badRequest();
      }
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (user === null) {
        throw fastify.httpErrors.notFound();
      }

      return await fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
