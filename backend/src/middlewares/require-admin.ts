import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../utils/app-error.js';

export async function requireAdmin(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  if (request.user?.role !== 'admin') {
    throw new AppError(403, 'Forbidden', 'Admin access required');
  }
}
