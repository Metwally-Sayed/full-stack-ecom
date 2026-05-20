import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody, validateQuery, validateParams } from '../../utils/zod.js';
import { listResponse, singleResponse, messageResponse } from '../../utils/response.js';
import {
  productQuerySchema,
  productParamsSchema,
  createProductSchema,
  updateProductSchema,
} from './products.schemas.js';
import * as productsService from './products.service.js';

export async function listProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(productQuerySchema, request.query);
  const result = await productsService.listProducts(query);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  const product = await productsService.getProduct(id);
  return reply.status(200).send(singleResponse(product));
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(createProductSchema, request.body);
  const product = await productsService.createProduct(body);
  return reply.status(201).send(singleResponse(product));
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  const body = validateBody(updateProductSchema, request.body);
  const product = await productsService.updateProduct(id, body);
  return reply.status(200).send(singleResponse(product));
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(productParamsSchema, request.params);
  await productsService.softDeleteProduct(id);
  return reply.status(200).send(messageResponse('Product deactivated successfully'));
}
