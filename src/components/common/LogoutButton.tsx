import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from '@/hooks/redux';
import { logout as logoutRedux } from '@/features/auth/authSlice';

/**
 * Logout button that handles Auth0 logout and Redux cleanup
 */
export const LogoutButton = () => {
  const { logout } = useAuth0();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear Redux state
    dispatch(logoutRedux());

    // Logout from Auth0 and redirect to home
    logout({
      logoutParams: {
        returnTo: "http://localhost:5173/auth",
      },
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
    >
      Log Out
    </button>
  );
};
