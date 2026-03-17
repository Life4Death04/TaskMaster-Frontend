import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { fetchTasksAPI, fetchTasksPaginatedAPI, getTaskByIdAPI } from '../request/tasks.api';

/**
 * Query hook to fetch all tasks (non-paginated)
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
 * Query hook to fetch tasks with pagination (Load More pattern)
 * Uses React Query's infinite query for accumulated pagination
 * 
 * @param limit - Number of items per page (default: 10)
 */
export const useFetchTasksPaginated = (limit: number = 10) => {
  return useInfiniteQuery({
    queryKey: ['tasks', 'paginated', limit],
    queryFn: ({ pageParam = 1 }) => fetchTasksPaginatedAPI(pageParam, limit),
    getNextPageParam: (lastPage) => {
      // If there's a next page, return the next page number
      // Otherwise return undefined to indicate no more pages
      return lastPage.pagination.hasNextPage
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
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
