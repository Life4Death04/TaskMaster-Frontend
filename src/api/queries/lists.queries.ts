import { useQuery } from '@tanstack/react-query';
import { fetchListsAPI, getListByIdAPI } from '../request/lists.api';

/**
 * Query hook to fetch all lists
 * Automatically refetches on window focus
 */
export const useFetchLists = () => {
  return useQuery({
    queryKey: ['lists'],
    queryFn: fetchListsAPI,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
};

/**
 * Query hook to fetch a single list by ID with tasks
 */
export const useGetListById = (listId: number) => {
  return useQuery({
    queryKey: ['lists', listId],
    queryFn: () => getListByIdAPI(listId),
    enabled: !!listId, // Only run query if listId exists
    staleTime: 1000 * 60 * 5,
  });
};
