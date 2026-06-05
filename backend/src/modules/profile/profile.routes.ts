import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import * as profileController from './profile.controller.js';

export async function profileRoutes(app: FastifyInstance): Promise<void> {
  const authHandler = { preHandler: [requireAuth] };

  app.patch('/', { schema: { tags: ['Profile'], summary: 'Update own profile' }, ...authHandler }, profileController.updateProfile);
  app.post('/deactivate', { schema: { tags: ['Profile'], summary: 'Deactivate own account' }, ...authHandler }, profileController.deactivateProfile);
  app.delete('/', { schema: { tags: ['Profile'], summary: 'Delete own account' }, ...authHandler }, profileController.deleteProfile);
}
