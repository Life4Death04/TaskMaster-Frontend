import { z } from 'zod';

/**
 * Schema for creating a new list
 */
export const createListSchema = z.object({
  title: z
    .string()
    .min(1, 'List name is required')
    .max(50, 'List name must be 50 characters or less'),
  description: z
    .string()
    .max(50, 'Description must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(
      /^#[0-9A-F]{6}$/i,
      'Color must be a valid hex color (e.g., #FF5733)'
    ),
});

/**
 * Schema for updating an existing list
 */
export const updateListSchema = z.object({
  title: z
    .string()
    .min(1, 'List name is required')
    .max(50, 'List name must be 50 characters or less')
    .optional(),
  description: z
    .string()
    .max(50, 'Description must be 50 characters or less')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF5733)')
    .optional(),
});

export type CreateListFormData = z.infer<typeof createListSchema>;
export type UpdateListFormData = z.infer<typeof updateListSchema>;
