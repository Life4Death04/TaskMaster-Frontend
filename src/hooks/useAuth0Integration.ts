import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  setUser,
  setToken,
  setLoading,
  logout,
} from '@/features/auth/authSlice';
import type { User } from '@/types';

/**
 * Custom hook that integrates Auth0 with Redux
 * Syncs authentication state between Auth0 and Redux store
 */
export const useAuth0Integration = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const syncAuth = async () => {
      dispatch(setLoading(true));

      if (isAuthenticated && user) {
        try {
          // Get the access token from Auth0
          const token = await getAccessTokenSilently();

          // Map Auth0 user to our User type
          const mappedUser: User = {
            id: 0, // Will be set from backend later
            firstName: user.given_name || user.name?.split(' ')[0] || 'User',
            lastName: user.family_name || user.name?.split(' ')[1] || '',
            email: user.email || '',
            profileImage: user.picture || null,
            emailVerified: user.email_verified,
          };

          // Update Redux state
          dispatch(setUser(mappedUser));
          dispatch(setToken(token));
        } catch (error) {
          console.error('Error getting access token:', error);
          dispatch(logout());
        }
      } else if (!isAuthenticated && reduxUser) {
        // User logged out from Auth0, clean up Redux
        dispatch(logout());
      }

      dispatch(setLoading(false));
    };

    if (!isLoading) {
      syncAuth();
    }
  }, [
    isAuthenticated,
    user,
    isLoading,
    getAccessTokenSilently,
    dispatch,
    reduxUser,
  ]);

  return {
    isLoading: isLoading || useAppSelector((state) => state.auth.isLoading),
    isAuthenticated: useAppSelector((state) => state.auth.isAuthenticated),
    user: useAppSelector((state) => state.auth.user),
  };
};
