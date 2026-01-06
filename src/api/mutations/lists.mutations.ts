import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createListAPI,
  updateListAPI,
  deleteListAPI,
} from '../request/lists.api';
import type { UpdateListDto } from '@/types';

/**
 * Mutation hook to create a new list
 * Automatically invalidates lists query on success
 */
export const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListAPI,
    onSuccess: () => {
      // Invalidate and refetch lists
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
    onError: (error: Error) => {
      console.error('Error creating list:', error);
    },
  });
};

/**
 * Mutation hook to update a list
 * Automatically invalidates lists query on success
 */
export const useUpdateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: UpdateListDto }) =>
      updateListAPI(params),
    onSuccess: (updatedList) => {
      // Invalidate lists and specific list
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      queryClient.invalidateQueries({ queryKey: ['lists', updatedList.id] });
    },
    onError: (error: Error) => {
      console.error('Error updating list:', error);
    },
  });
};

/**
 * Mutation hook to delete a list
 * Automatically invalidates lists query on success
 */
export const useDeleteList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListAPI,
    onSuccess: () => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: ['lists'] });
      // Also invalidate tasks since deleting list affects tasks
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting list:', error);
    },
  });
};
