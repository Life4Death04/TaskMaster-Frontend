import { useQuery } from '@tanstack/react-query';
import { fetchSettingsAPI } from '../request/settings.api';

/**
 * Query hook to fetch user settings
 * Automatically refetches on window focus
 */
export const useFetchSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettingsAPI,
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes (settings change less frequently)
  });
};
