import { ZodSchema, ZodError } from 'zod';
import { AppError } from './app-error.js';

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');
}

export function validateBody<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}

export function validateQuery<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}

export function validateParams<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new AppError(400, 'Bad Request', formatZodError(result.error));
  }
  return result.data;
}
