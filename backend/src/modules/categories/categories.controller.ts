import { FastifyRequest, FastifyReply } from 'fastify';
import { listResponse } from '../../utils/response.js';
import * as categoriesService from './categories.service.js';

export async function getCategories(_request: FastifyRequest, reply: FastifyReply) {
  const categories = await categoriesService.getCategories();
  return reply.status(200).send(listResponse(categories, {}));
}
