import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/auth/authSlice';
import { updateUserAPI, deleteUserAPI } from '../request/users.api';

/**
 * React Query mutation hook to update user profile
 * Updates firstName and/or lastName and syncs with Redux
 */
export const useUpdateUser = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateUserAPI,
    retry: false,
    onSuccess: (updatedUser) => {
      console.log('✅ User updated successfully:', updatedUser);
      // Update Redux state with new user data
      dispatch(setUser(updatedUser));
    },
    onError: (error: Error) => {
      console.error('❌ Update user error:', error);
    },
  });
};

/**
 * React Query mutation hook to delete user account
 * Permanently deletes the user's account
 */
export const useDeleteUser = () => {
  return useMutation({
    mutationFn: deleteUserAPI,
    retry: false,
    onSuccess: () => {
      console.log('✅ User deleted successfully');
    },
    onError: (error: Error) => {
      console.error('❌ Delete user error:', error);
    },
  });
};
