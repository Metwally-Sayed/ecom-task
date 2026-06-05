import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody } from '../../utils/zod.js';
import { messageResponse } from '../../utils/response.js';
import { updateProfileSchema } from './profile.schemas.js';
import * as profileService from './profile.service.js';

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(updateProfileSchema, request.body);
  await profileService.updateOwnProfile(request.user.id, body);
  return reply.status(200).send(messageResponse('Profile updated successfully'));
}

export async function deactivateProfile(request: FastifyRequest, reply: FastifyReply) {
  await profileService.deactivateOwnProfile(request.user.id);
  return reply.status(200).send(messageResponse('Account deactivated'));
}

export async function deleteProfile(request: FastifyRequest, reply: FastifyReply) {
  await profileService.deleteOwnProfile(request.user.id);
  return reply.status(200).send(messageResponse('Account deleted'));
}
