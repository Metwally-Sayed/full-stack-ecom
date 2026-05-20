import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody } from '../../utils/zod.js';
import { singleResponse, messageResponse } from '../../utils/response.js';
import { registerSchema, loginSchema, forgotPasswordSchema } from './auth.schemas.js';
import * as authService from './auth.service.js';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(registerSchema, request.body);
  const result = await authService.register(body);
  return reply.status(201).send(singleResponse(result));
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(loginSchema, request.body);
  const result = await authService.login(body);
  return reply.status(200).send(singleResponse(result));
}

export async function forgotPassword(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(forgotPasswordSchema, request.body);
  await authService.forgotPassword(body);
  return reply.status(200).send(messageResponse('Password reset email sent'));
}

export async function me(request: FastifyRequest, reply: FastifyReply) {
  const profile = await authService.me(request.user.id);
  return reply.status(200).send(singleResponse(profile));
}
