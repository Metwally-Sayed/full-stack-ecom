import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import * as authController from './auth.controller.js';

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/register', {
    schema: { tags: ['Auth'], summary: 'Register a new customer account' },
  }, authController.register);

  app.post('/login', {
    schema: { tags: ['Auth'], summary: 'Login and receive JWT tokens' },
  }, authController.login);

  app.post('/forgot-password', {
    schema: { tags: ['Auth'], summary: 'Send password reset email' },
  }, authController.forgotPassword);

  app.get('/me', {
    schema: {
      tags: ['Auth'],
      summary: 'Get the current authenticated user profile',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, authController.me);
}
