import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import { corsPlugin } from './plugins/cors.plugin.js';
import { errorHandlerPlugin } from './plugins/error-handler.plugin.js';
import { swaggerPlugin } from './plugins/swagger.plugin.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { categoriesRoutes } from './modules/categories/categories.routes.js';
import { productsRoutes } from './modules/products/products.routes.js';
import { ordersRoutes } from './modules/orders/orders.routes.js';
import { uploadsRoutes } from './modules/uploads/uploads.routes.js';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: 'info',
    },
  });

  // Plugins — error handler first so it catches plugin/route errors too
  app.register(errorHandlerPlugin);
  app.register(corsPlugin);
  app.register(swaggerPlugin);
  app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  });

  // Health check
  app.get(
    '/health',
    { schema: { tags: ['Health'], summary: 'Health check' } },
    async () => ({ status: 'ok' }),
  );

  // Feature routes
  app.register(authRoutes, { prefix: '/auth' });
  app.register(categoriesRoutes, { prefix: '/categories' });
  app.register(productsRoutes, { prefix: '/products' });
  app.register(ordersRoutes, { prefix: '/orders' });
  app.register(uploadsRoutes, { prefix: '/uploads' });

  return app;
}
