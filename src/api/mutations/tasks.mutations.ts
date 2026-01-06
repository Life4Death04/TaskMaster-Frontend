import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
  toggleTaskArchivedAPI,
  toggleTaskStatusAPI,
} from '../request/tasks.api';
import type { Task, UpdateTaskDto } from '@/types';

/**
 * Mutation hook to create a new task
 * Automatically invalidates tasks query on success
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskAPI,
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      console.error('Error creating task:', error);
    },
  });
};

/**
 * Mutation hook to update a task
 * Automatically invalidates tasks query on success
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: UpdateTaskDto }) =>
      updateTaskAPI(params),
    onSuccess: (updatedTask) => {
      // Invalidate tasks list and specific task
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] });
    },
    onError: (error: Error) => {
      console.error('Error updating task:', error);
    },
  });
};

/**
 * Mutation hook to delete a task
 * Automatically invalidates tasks query on success
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskAPI,
    onSuccess: () => {
      // Invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting task:', error);
    },
  });
};

/**
 * Mutation hook to toggle task archived status
 * Automatically invalidates tasks query on success
 */
export const useToggleTaskArchived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTaskArchivedAPI,
    onSuccess: (updatedTask: Task) => {
      // Invalidate tasks list and specific task
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] });
    },
    onError: (error: Error) => {
      console.error('Error toggling archived status:', error);
    },
  });
};

/**
 * Mutation hook to toggle task status (TODO <-> DONE)
 * Automatically invalidates tasks query on success
 */
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTaskStatusAPI,
    onSuccess: (updatedTask: Task) => {
      // Invalidate tasks list and specific task
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', updatedTask.id] });
    },
    onError: (error: Error) => {
      console.error('Error toggling task status:', error);
    },
  });
};
