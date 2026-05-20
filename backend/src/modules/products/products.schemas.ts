import { z } from 'zod';

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).optional().default('active'),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
});

export const productParamsSchema = z.object({
  id: z.string().uuid('Product ID must be a valid UUID'),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be >= 0'),
  imageUrl: z.string().url('imageUrl must be a valid URL').optional(),
  categoryId: z.string().uuid('categoryId must be a valid UUID'),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().nullable().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});
