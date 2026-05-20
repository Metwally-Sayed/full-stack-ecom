import { UserRole } from './common.js';

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}
