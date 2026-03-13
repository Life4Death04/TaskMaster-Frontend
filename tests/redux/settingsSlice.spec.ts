import { test, expect } from '@playwright/test';
import settingsReducer, {
  setSettings,
  updateSettings,
  setLoading,
  setError,
} from '../../src/features/settings/settingsSlice';
import type { Settings } from '../../src/types';

// Mock settings data
const mockSettings: Settings = {
  id: 1,
  userId: 1,
  theme: 'DARK',
  language: 'EN',
  dateFormat: 'MM_DD_YYYY',
  defaultPriority: 'MEDIUM',
  defaultStatus: 'TODO',
};

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('settingsSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = settingsReducer(undefined, { type: 'unknown' });

    expect(state.settings).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// setSettings Action Tests
// ============================================================================
test.describe('settingsSlice - setSettings', () => {
  test('should set settings and clear error', () => {
    const state = settingsReducer(undefined, setSettings(mockSettings));

    expect(state.settings).toEqual(mockSettings);
    expect(state.error).toBeNull();
  });

  test('should replace existing settings', () => {
    const initialState = {
      settings: {
        ...mockSettings,
        theme: 'LIGHT' as const,
      },
      isLoading: false,
      error: 'Previous error',
    };

    const state = settingsReducer(initialState, setSettings(mockSettings));

    expect(state.settings).toEqual(mockSettings);
    expect(state.settings?.theme).toBe('DARK');
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// updateSettings Action Tests
// ============================================================================
test.describe('settingsSlice - updateSettings', () => {
  test('should update partial settings when settings exist', () => {
    const initialState = {
      settings: mockSettings,
      isLoading: false,
      error: null,
    };

    const state = settingsReducer(
      initialState,
      updateSettings({ theme: 'LIGHT', language: 'ES' })
    );

    expect(state.settings?.theme).toBe('LIGHT');
    expect(state.settings?.language).toBe('ES');
    expect(state.settings?.dateFormat).toBe('MM_DD_YYYY'); // unchanged
  });

  test('should update single setting field', () => {
    const initialState = {
      settings: mockSettings,
      isLoading: false,
      error: null,
    };

    const state = settingsReducer(
      initialState,
      updateSettings({ defaultPriority: 'HIGH' })
    );

    expect(state.settings?.defaultPriority).toBe('HIGH');
    expect(state.settings?.theme).toBe('DARK'); // unchanged
  });

  test('should not modify state when settings is null', () => {
    const initialState = {
      settings: null,
      isLoading: false,
      error: null,
    };

    const state = settingsReducer(
      initialState,
      updateSettings({ theme: 'LIGHT' })
    );

    expect(state.settings).toBeNull();
  });

  test('should update all fields when provided', () => {
    const initialState = {
      settings: mockSettings,
      isLoading: false,
      error: null,
    };

    const updates: Partial<Settings> = {
      theme: 'LIGHT',
      language: 'ES',
      dateFormat: 'DD_MM_YYYY',
      defaultPriority: 'HIGH',
      defaultStatus: 'IN_PROGRESS',
    };

    const state = settingsReducer(initialState, updateSettings(updates));

    expect(state.settings?.theme).toBe('LIGHT');
    expect(state.settings?.language).toBe('ES');
    expect(state.settings?.dateFormat).toBe('DD_MM_YYYY');
    expect(state.settings?.defaultPriority).toBe('HIGH');
    expect(state.settings?.defaultStatus).toBe('IN_PROGRESS');
  });
});

// ============================================================================
// setLoading Action Tests
// ============================================================================
test.describe('settingsSlice - setLoading', () => {
  test('should set loading to true', () => {
    const state = settingsReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  test('should set loading to false', () => {
    const initialState = {
      settings: null,
      isLoading: true,
      error: null,
    };

    const state = settingsReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// setError Action Tests
// ============================================================================
test.describe('settingsSlice - setError', () => {
  test('should set error and stop loading', () => {
    const initialState = {
      settings: null,
      isLoading: true,
      error: null,
    };

    const state = settingsReducer(
      initialState,
      setError('Failed to load settings')
    );

    expect(state.error).toBe('Failed to load settings');
    expect(state.isLoading).toBe(false);
  });

  test('should clear error when null', () => {
    const initialState = {
      settings: null,
      isLoading: false,
      error: 'Previous error',
    };

    const state = settingsReducer(initialState, setError(null));
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// Complex Scenario Tests
// ============================================================================
test.describe('settingsSlice - Complex Scenarios', () => {
  test('should handle complete settings update flow', () => {
    let state = settingsReducer(undefined, { type: 'unknown' });

    // Start loading
    state = settingsReducer(state, setLoading(true));
    expect(state.isLoading).toBe(true);

    // Load settings
    state = settingsReducer(state, setSettings(mockSettings));
    expect(state.settings).toEqual(mockSettings);

    // Update theme
    state = settingsReducer(state, updateSettings({ theme: 'LIGHT' }));
    expect(state.settings?.theme).toBe('LIGHT');

    // Update language and date format
    state = settingsReducer(
      state,
      updateSettings({ language: 'ES', dateFormat: 'DD_MM_YYYY' })
    );
    expect(state.settings?.language).toBe('ES');
    expect(state.settings?.dateFormat).toBe('DD_MM_YYYY');
  });

  test('should handle error during settings update', () => {
    const initialState = {
      settings: mockSettings,
      isLoading: true,
      error: null,
    };

    const state = settingsReducer(
      initialState,
      setError('Failed to update settings')
    );

    expect(state.error).toBe('Failed to update settings');
    expect(state.isLoading).toBe(false);
    expect(state.settings).toEqual(mockSettings); // settings unchanged
  });

  test('should handle multiple consecutive updates', () => {
    let state = settingsReducer(undefined, setSettings(mockSettings));

    // Update 1: Change theme
    state = settingsReducer(state, updateSettings({ theme: 'LIGHT' }));
    expect(state.settings?.theme).toBe('LIGHT');

    // Update 2: Change language
    state = settingsReducer(state, updateSettings({ language: 'ES' }));
    expect(state.settings?.language).toBe('ES');
    expect(state.settings?.theme).toBe('LIGHT'); // still LIGHT

    // Update 3: Change default priority
    state = settingsReducer(state, updateSettings({ defaultPriority: 'HIGH' }));
    expect(state.settings?.defaultPriority).toBe('HIGH');
    expect(state.settings?.theme).toBe('LIGHT'); // still LIGHT
    expect(state.settings?.language).toBe('ES'); // still ES
  });
});
