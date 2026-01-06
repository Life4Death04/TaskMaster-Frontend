import api from '@/lib/axios';
import type { Task, CreateTaskDto, UpdateTaskDto, ApiResponse } from '@/types';

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
  const response = await api.get<ApiResponse<{ tasks: Task[] }>>(
    ENDPOINTS.TASKS
  );
  return response.data.data?.tasks || [];
};

/**
 * Get a single task by ID
 */
export const getTaskByIdAPI = async (taskId: number): Promise<Task> => {
  const response = await api.get<ApiResponse<{ data: Task }>>(
    ENDPOINTS.TASK_BY_ID(taskId)
  );

  if (!response.data.data?.data) {
    throw new Error('Task not found');
  }

  return response.data.data.data;
};

/**
 * Create a new task
 */
export const createTaskAPI = async (data: CreateTaskDto): Promise<Task> => {
  const response = await api.post<ApiResponse<{ data: Task }>>(
    ENDPOINTS.TASKS,
    data
  );

  if (!response.data.data?.data) {
    throw new Error('Failed to create task');
  }

  return response.data.data.data;
};

/**
 * Update an existing task
 */
export const updateTaskAPI = async (params: {
  id: number;
  data: UpdateTaskDto;
}): Promise<Task> => {
  const { id, data } = params;
  const response = await api.patch<ApiResponse<{ data: Task }>>(
    ENDPOINTS.TASKS,
    {
      id,
      ...data,
    }
  );

  if (!response.data.data?.data) {
    throw new Error('Failed to update task');
  }

  return response.data.data.data;
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
  const response = await api.patch<ApiResponse<{ data: Task }>>(
    ENDPOINTS.TOGGLE_ARCHIVED(taskId)
  );

  if (!response.data.data?.data) {
    throw new Error('Failed to toggle archived status');
  }

  return response.data.data.data;
};

/**
 * Toggle task status (TODO <-> DONE)
 */
export const toggleTaskStatusAPI = async (taskId: number): Promise<Task> => {
  const response = await api.patch<ApiResponse<{ data: Task }>>(
    ENDPOINTS.TOGGLE_STATUS(taskId)
  );

  if (!response.data.data?.data) {
    throw new Error('Failed to toggle task status');
  }

  return response.data.data.data;
};
