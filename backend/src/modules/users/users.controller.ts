import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody, validateQuery, validateParams } from '../../utils/zod.js';
import { listResponse, singleResponse, messageResponse } from '../../utils/response.js';
import { userQuerySchema, userParamsSchema, createUserSchema, updateUserSchema } from './users.schemas.js';
import * as usersService from './users.service.js';

export async function listUsers(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(userQuerySchema, request.query);
  const result = await usersService.listUsers(query);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(userParamsSchema, request.params);
  const user = await usersService.getUser(id);
  return reply.status(200).send(singleResponse(user));
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(createUserSchema, request.body);
  const user = await usersService.createUser(body);
  return reply.status(201).send(singleResponse(user));
}

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(userParamsSchema, request.params);
  const body = validateBody(updateUserSchema, request.body);
  const user = await usersService.updateUser(request.user.id, id, body);
  return reply.status(200).send(singleResponse(user));
}

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(userParamsSchema, request.params);
  await usersService.deleteUser(request.user.id, id);
  return reply.status(200).send(messageResponse('User deleted successfully'));
}
