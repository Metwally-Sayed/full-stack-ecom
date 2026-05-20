import { FastifyInstance } from 'fastify';
import * as categoriesController from './categories.controller.js';

export async function categoriesRoutes(app: FastifyInstance): Promise<void> {
  app.get('/', {
    schema: { tags: ['Categories'], summary: 'Get all product categories' },
  }, categoriesController.getCategories);
}
