import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import * as usersController from './users.controller.js';

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  const adminHandlers = { preHandler: [requireAuth, requireAdmin] };

  app.get('/', { schema: { tags: ['Users'], summary: 'List users (admin)' }, ...adminHandlers }, usersController.listUsers);
  app.get('/:id', { schema: { tags: ['Users'], summary: 'Get user (admin)' }, ...adminHandlers }, usersController.getUser);
  app.post('/', { schema: { tags: ['Users'], summary: 'Create user (admin)' }, ...adminHandlers }, usersController.createUser);
  app.patch('/:id', { schema: { tags: ['Users'], summary: 'Update user (admin)' }, ...adminHandlers }, usersController.updateUser);
  app.delete('/:id', { schema: { tags: ['Users'], summary: 'Delete user (admin)' }, ...adminHandlers }, usersController.deleteUser);
}
