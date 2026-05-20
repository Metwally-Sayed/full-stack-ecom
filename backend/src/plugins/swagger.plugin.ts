import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Mini Shop API',
        description:
          'REST API for the Mini Shop challenge — serves Expo mobile app and React admin dashboard.',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication and user profile' },
        { name: 'Categories', description: 'Product categories' },
        { name: 'Products', description: 'Product catalog' },
        { name: 'Orders', description: 'Order management' },
        { name: 'Uploads', description: 'File uploads' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}
