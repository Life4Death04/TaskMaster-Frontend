import { test, expect } from '@playwright/test';
import authReducer, {
  setUser,
  setToken,
  logout,
  setLoading,
  setError,
} from '../../src/features/auth/authSlice';
import type { User } from '../../src/types';

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('authSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = authReducer(undefined, { type: 'unknown' });

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// setUser Action Tests
// ============================================================================
test.describe('authSlice - setUser', () => {
  test('should set user and mark as authenticated', () => {
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      createdAt: '2026-01-01',
    };

    const state = authReducer(undefined, setUser(mockUser));

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  test('should clear user and mark as not authenticated when user is null', () => {
    const initialState = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: '2026-01-01',
      },
      token: 'some-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const state = authReducer(initialState, setUser(null));

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// setToken Action Tests
// ============================================================================
test.describe('authSlice - setToken', () => {
  test('should set token in state', () => {
    const token = 'test-token-123';
    const state = authReducer(undefined, setToken(token));

    expect(state.token).toBe(token);
  });

  test('should clear token when null is provided', () => {
    const initialState = {
      user: null,
      token: 'existing-token',
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };

    const state = authReducer(initialState, setToken(null));

    expect(state.token).toBeNull();
  });
});

// ============================================================================
// logout Action Tests
// ============================================================================
test.describe('authSlice - logout', () => {
  test('should clear all auth data', () => {
    const initialState = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: '2026-01-01',
      },
      token: 'test-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const state = authReducer(initialState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('should work even when already logged out', () => {
    const initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    };

    const state = authReducer(initialState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

// ============================================================================
// setLoading Action Tests
// ============================================================================
test.describe('authSlice - setLoading', () => {
  test('should set loading to true', () => {
    const state = authReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  test('should set loading to false', () => {
    const initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };

    const state = authReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// setError Action Tests
// ============================================================================
test.describe('authSlice - setError', () => {
  test('should set error message and stop loading', () => {
    const initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,
    };

    const errorMessage = 'Authentication failed';
    const state = authReducer(initialState, setError(errorMessage));

    expect(state.error).toBe(errorMessage);
    expect(state.isLoading).toBe(false);
  });

  test('should clear error when null is provided', () => {
    const initialState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: 'Previous error',
    };

    const state = authReducer(initialState, setError(null));

    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// Complex Scenario Tests
// ============================================================================
test.describe('authSlice - Complex Scenarios', () => {
  test('should handle complete login flow', () => {
    let state = authReducer(undefined, { type: 'unknown' });

    // Start loading
    state = authReducer(state, setLoading(true));
    expect(state.isLoading).toBe(true);

    // Set token
    state = authReducer(state, setToken('auth-token-123'));
    expect(state.token).toBe('auth-token-123');

    // Set user
    const mockUser: User = {
      id: 1,
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2026-01-01',
    };
    state = authReducer(state, setUser(mockUser));

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
  });

  test('should handle failed login with error', () => {
    let state = authReducer(undefined, setLoading(true));

    // Set error
    state = authReducer(state, setError('Invalid credentials'));

    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
  });

  test('should handle logout after being authenticated', () => {
    const authenticatedState = {
      user: {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: '2026-01-01',
      },
      token: 'active-token',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };

    const state = authReducer(authenticatedState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
