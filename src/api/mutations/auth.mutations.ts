import { useMutation } from '@tanstack/react-query';
import type { User as Auth0User } from '@auth0/auth0-react';
import {
  registerUserAPI,
  loginUserAPI,
  syncUserWithBackendAPI,
} from '../request/auth.api';

/**
 * React Query mutation hook for user registration
 * Creates a new user account in both Auth0 and backend
 */
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUserAPI,
    onError: (error: Error) => {
      console.error('Registration error:', error);
    },
  });
};

/**
 * React Query mutation hook for user login
 * Authenticates user with email and password
 */
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUserAPI,
    onError: (error: Error) => {
      console.error('Login error:', error);
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
    onError: (error: Error) => {
      console.error('Error checking user in backend:', error);

      // If user doesn't exist in backend, throw error to redirect to register
      if (error.message === 'USER_NOT_REGISTERED') {
        throw new Error('USER_NOT_REGISTERED');
      }
    },
  });
};
