import { z } from 'zod';

/**
 * Zod validation schema for creating a new task
 */
export const createTaskSchema = z.object({
  taskName: z
    .string()
    .min(1, 'Task name is required')
    .max(50, 'Task name must be less than 50 characters'),
  description: z
    .string()
    .max(100, 'Description must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  dueDate: z.string().optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  listId: z.number().int().positive().optional().nullable(),
});

/**
 * Zod validation schema for editing an existing task
 */
export const editTaskSchema = z.object({
  taskName: z
    .string()
    .min(1, 'Task name is required')
    .max(50, 'Task name must be less than 50 characters'),
  description: z
    .string()
    .max(100, 'Description must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
  dueDate: z.string().optional().or(z.literal('')),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  listId: z.number().int().positive().optional().nullable(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;
