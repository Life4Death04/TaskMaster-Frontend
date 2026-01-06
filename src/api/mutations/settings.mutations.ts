import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSettingsAPI } from '../request/settings.api';

/**
 * Mutation hook to update user settings
 * Automatically invalidates settings query on success
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettingsAPI,
    onSuccess: () => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: Error) => {
      console.error('Error updating settings:', error);
    },
  });
};
