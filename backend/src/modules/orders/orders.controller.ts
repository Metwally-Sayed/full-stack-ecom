import { FastifyRequest, FastifyReply } from 'fastify';
import { validateBody, validateQuery, validateParams } from '../../utils/zod.js';
import { listResponse, singleResponse } from '../../utils/response.js';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderQuerySchema,
  orderParamsSchema,
  myOrderQuerySchema,
} from './orders.schemas.js';
import * as ordersService from './orders.service.js';
import type { OrderStatus } from '../../types/common.js';

export async function createOrder(request: FastifyRequest, reply: FastifyReply) {
  const body = validateBody(createOrderSchema, request.body);
  const order = await ordersService.createOrder(request.user.id, body);
  return reply.status(201).send(singleResponse(order));
}

export async function getMyOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(myOrderQuerySchema, request.query);
  const result = await ordersService.getMyOrders(request.user.id, query.page, query.limit);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function getAllOrders(request: FastifyRequest, reply: FastifyReply) {
  const query = validateQuery(orderQuerySchema, request.query);
  const result = await ordersService.getAllOrders(query);
  return reply.status(200).send(listResponse(result.data, result.meta));
}

export async function updateOrderStatus(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateParams(orderParamsSchema, request.params);
  const body = validateBody(updateOrderStatusSchema, request.body);
  const order = await ordersService.updateOrderStatus(id, body.status as OrderStatus);
  return reply.status(200).send(singleResponse(order));
}
