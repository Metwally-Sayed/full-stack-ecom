import { FastifyInstance } from 'fastify';
import { requireAuth } from '../../middlewares/require-auth.js';
import { requireAdmin } from '../../middlewares/require-admin.js';
import * as ordersController from './orders.controller.js';

export async function ordersRoutes(app: FastifyInstance): Promise<void> {
  app.post('/', {
    schema: {
      tags: ['Orders'],
      summary: 'Place a new order — server-side price calculation',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, ordersController.createOrder);

  app.get('/my', {
    schema: {
      tags: ['Orders'],
      summary: "Get current user's order history",
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth],
  }, ordersController.getMyOrders);

  app.get('/', {
    schema: {
      tags: ['Orders'],
      summary: 'List all orders with user info (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, ordersController.getAllOrders);

  app.patch('/:id/status', {
    schema: {
      tags: ['Orders'],
      summary: 'Update order status (admin)',
      security: [{ bearerAuth: [] }],
    },
    preHandler: [requireAuth, requireAdmin],
  }, ordersController.updateOrderStatus);
}
