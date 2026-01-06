import { useQuery } from '@tanstack/react-query';
import { fetchTasksAPI, getTaskByIdAPI } from '../request/tasks.api';

/**
 * Query hook to fetch all tasks
 * Automatically refetches on window focus and every 5 minutes
 */
export const useFetchTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasksAPI,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

/**
 * Query hook to fetch a single task by ID
 */
export const useGetTaskById = (taskId: number) => {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => getTaskByIdAPI(taskId),
    enabled: !!taskId, // Only run query if taskId exists
    staleTime: 1000 * 60 * 5,
  });
};
