import { useMutation } from '@tanstack/react-query';
import type { User as Auth0User } from '@auth0/auth0-react';
import { registerUserAPI, syncUserWithBackendAPI } from './auth.api';

/**
 * React Query mutation hook for user registration
 * Creates a new user account in both Auth0 and backend
 */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUserAPI,
    onError: (error: any) => {
      console.error('Registration error:', error);
    },
  });
};

/**
 * React Query mutation hook to sync user with backend
 * Checks if user exists in backend database
 */
export const useSyncUserWithBackend = () => {
  return useMutation({
    mutationFn: ({
      auth0User,
      token,
    }: {
      auth0User: Auth0User;
      token: string;
    }) => syncUserWithBackendAPI(auth0User, token),
    onError: (error: any) => {
      console.error('Error checking user in backend:', error);

      // If user doesn't exist in backend, throw error to redirect to register
      if (error.response?.status === 404) {
        throw new Error('USER_NOT_REGISTERED');
      }
    },
  });
};
