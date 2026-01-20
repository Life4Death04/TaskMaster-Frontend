import api from '@/lib/axios';
import type { Task } from '@/types';
import type {
  CreateTaskFormData,
  EditTaskFormData,
} from '@/schemas/task.schemas';

// API Endpoints
const ENDPOINTS = {
  TASKS: '/tasks',
  TASK_BY_ID: (id: number) => `/tasks/${id}`,
  TOGGLE_ARCHIVED: (id: number) => `/tasks/${id}/toggle-archived`,
  TOGGLE_STATUS: (id: number) => `/tasks/${id}/toggle-status`,
};

/**
 * Fetch all tasks for authenticated user
 */
export const fetchTasksAPI = async (): Promise<Task[]> => {
  const response = await api.get<{ data: Task[] }>(ENDPOINTS.TASKS);
  return response.data.data || [];
};

/**
 * Get a single task by ID
 */
export const getTaskByIdAPI = async (taskId: number): Promise<Task> => {
  const response = await api.get<Task>(ENDPOINTS.TASK_BY_ID(taskId));

  if (!response.data) {
    throw new Error('Task not found');
  }

  return response.data;
};

/**
 * Create a new task
 */
export const createTaskAPI = async (
  data: CreateTaskFormData
): Promise<Task> => {
  const response = await api.post<Task>(ENDPOINTS.TASKS, data);

  if (!response.data) {
    throw new Error('Failed to create task');
  }

  return response.data;
};

/**
 * Update an existing task
 */
export const updateTaskAPI = async (params: {
  id: number;
  data: EditTaskFormData;
}): Promise<Task> => {
  const { id, data } = params;
  const response = await api.patch<Task>(ENDPOINTS.TASKS, {
    id,
    ...data,
  });

  if (!response.data) {
    throw new Error('Failed to update task');
  }

  return response.data;
};

/**
 * Delete a task
 */
export const deleteTaskAPI = async (taskId: number): Promise<void> => {
  await api.delete(ENDPOINTS.TASK_BY_ID(taskId));
};

/**
 * Toggle task archived status
 */
export const toggleTaskArchivedAPI = async (taskId: number): Promise<Task> => {
  const response = await api.patch<Task>(ENDPOINTS.TOGGLE_ARCHIVED(taskId));

  if (!response.data) {
    throw new Error('Failed to toggle archived status');
  }

  return response.data;
};

/**
 * Toggle task status (TODO <-> DONE)
 */
export const toggleTaskStatusAPI = async (taskId: number): Promise<Task> => {
  const response = await api.patch<Task>(ENDPOINTS.TOGGLE_STATUS(taskId));

  if (!response.data) {
    throw new Error('Failed to toggle task status');
  }

  return response.data;
};
