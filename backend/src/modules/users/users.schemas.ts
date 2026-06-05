import { z } from 'zod';

export const userQuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(['all', 'admin', 'customer']).optional().default('all'),
  status: z.enum(['all', 'active', 'deactivated', 'blocked']).optional().default('all'),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
});

export const userParamsSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID'),
});

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['customer', 'admin']),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(['customer', 'admin']).optional(),
  status: z.enum(['active', 'deactivated', 'blocked']).optional(),
});
