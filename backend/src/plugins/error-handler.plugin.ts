import { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { env } from '../config/env.js';

export async function errorHandlerPlugin(app: FastifyInstance): Promise<void> {
  app.setErrorHandler((error: FastifyError | AppError | ZodError | Error, _request, reply) => {
    if (env.NODE_ENV === 'development') {
      console.error(error);
    }

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      });
    }

    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Validation failed',
      });
    }

    const fastifyErr = error as FastifyError;
    if (fastifyErr.statusCode === 400) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: fastifyErr.message,
      });
    }

    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Something went wrong',
    });
  });
}
