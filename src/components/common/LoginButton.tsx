import { useAuth0 } from '@auth0/auth0-react';

/**
 * Simple Login button that redirects to Auth0 Universal Login
 */
export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
    >
      Log In
    </button>
  );
};
