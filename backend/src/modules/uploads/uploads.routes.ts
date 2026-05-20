import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import { uploadImage } from './uploads.controller.js';

export async function uploadsRoutes(app: FastifyInstance): Promise<void> {
  app.post('/product-image', {
    schema: {
      tags: ['Uploads'],
      summary: 'Upload a product image to Supabase Storage (admin)',
      security: [{ bearerAuth: [] }],
      consumes: ['multipart/form-data'],
    },
    preHandler: [requireAuth, requireAdmin],
  }, uploadImage);
}
