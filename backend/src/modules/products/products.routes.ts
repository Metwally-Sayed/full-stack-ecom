import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import * as productsController from './products.controller.js';

export async function productsRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', {
    schema: { tags: ['Products'], summary: 'List products (search, category, status, pagination)' },
  }, productsController.listProducts);

  app.get('/:id', {
    schema: { tags: ['Products'], summary: 'Get a single active product by ID' },
  }, productsController.getProduct);

  app.post('/', {
    schema: {
      tags: ['Products'],
      summary: 'Create a product (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.createProduct);

  app.patch('/:id', {
    schema: {
      tags: ['Products'],
      summary: 'Update a product (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.updateProduct);

  app.delete('/:id', {
    schema: {
      tags: ['Products'],
      summary: 'Soft-delete a product — sets is_active = false (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, productsController.deleteProduct);
}
