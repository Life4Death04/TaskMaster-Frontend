import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import i18n from '../../src/i18n';
import authReducer from '../../src/features/auth/authSlice';
import listsReducer from '../../src/features/lists/listsSlice';
import tasksReducer from '../../src/features/tasks/tasksSlice';
import settingsReducer from '../../src/features/settings/settingsSlice';
import uiReducer from '../../src/features/ui/uiSlice';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import type { RootState } from '../../src/app/store';

// ============================================================================
// Test Store Setup
// ============================================================================

/**
 * Creates a Redux store for testing with optional preloaded state
 */
export function createTestStore(preloadedState?: any) {
    return configureStore({
        reducer: {
            auth: authReducer,
            tasks: tasksReducer,
            lists: listsReducer,
            settings: settingsReducer,
            ui: uiReducer,
        } as any,
        preloadedState,
    });
}

// ============================================================================
// Test Query Client Setup
// ============================================================================

/**
 * Creates a React Query client for testing with disabled retries
 */
export function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    });
}

// ============================================================================
// All Providers Wrapper
// ============================================================================

interface AllProvidersProps {
    children: React.ReactNode;
    store?: ReturnType<typeof createTestStore>;
    queryClient?: QueryClient;
    initialRoute?: string;
    routes?: ReactElement;
}

/**
 * Wrapper component that provides all necessary providers for testing
 */
export function AllProviders({
    children,
    store = createTestStore(),
    queryClient = createTestQueryClient(),
    initialRoute = '/',
    routes,
}: AllProvidersProps) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                    <ThemeProvider>
                        <MemoryRouter initialEntries={[initialRoute]}>
                            {routes ? (
                                <Routes>
                                    {routes}
                                </Routes>
                            ) : (
                                children
                            )}
                        </MemoryRouter>
                    </ThemeProvider>
                </I18nextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

// ============================================================================
// Mock Data Factories
// ============================================================================

/**
 * Creates a mock user for testing
 */
export const createMockUser = (overrides = {}) => ({
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    ...overrides,
});

/**
 * Creates a mock task for testing
 */
export const createMockTask = (overrides = {}) => ({
    id: 1,
    taskName: 'Test Task',
    description: 'Test Description',
    status: 'PENDING' as const,
    priority: 'MEDIUM' as const,
    dueDate: new Date().toISOString(),
    listId: null,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
});

/**
 * Creates a mock list for testing
 */
export const createMockList = (overrides = {}) => ({
    id: 1,
    title: 'Test List',
    description: 'Test Description',
    color: '#3B82F6',
    icon: '📋',
    isFavorite: false,
    userId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
    ...overrides,
});

/**
 * Creates mock settings for testing
 */
export const createMockSettings = (overrides = {}) => ({
    id: 1,
    theme: 'light' as const,
    language: 'en' as const,
    dateFormat: 'MM_DD_YYYY' as const,
    timeFormat: '12H' as const,
    weekStartsOn: 'SUNDAY' as const,
    defaultTaskPriority: 'MEDIUM' as const,
    enableNotifications: true,
    userId: 1,
    ...overrides,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Creates initial Redux state for testing
 */
export const createInitialState = (overrides: Partial<RootState> = {}): Partial<RootState> => ({
    auth: {
        user: createMockUser(),
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
    },
    tasks: {
        tasks: [],
        selectedTask: null,
    },
    lists: {
        lists: [],
        selectedList: null,
    },
    settings: {
        settings: createMockSettings(),
    },
    ui: {
        isLoading: false,
        modal: {
            isOpen: false,
            type: null,
        },
        toasts: [],
        sidebarOpen: true,
    },
    ...overrides,
});

// ============================================================================
// Custom Render Function
// ============================================================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    preloadedState?: Partial<RootState>;
    store?: ReturnType<typeof createTestStore>;
    queryClient?: QueryClient;
    initialRoute?: string;
}

/**
 * Custom render function that wraps component with all providers
 * Usage: render(<MyComponent />, { preloadedState: {...} })
 */
export function renderWithProviders(
    ui: ReactElement,
    {
        preloadedState = createInitialState(),
        store = createTestStore(preloadedState),
        queryClient = createTestQueryClient(),
        initialRoute = '/',
        ...renderOptions
    }: CustomRenderOptions = {}
) {
    function Wrapper({ children }: { children: React.ReactNode }) {
        return (
            <AllProviders
                store={store}
                queryClient={queryClient}
                initialRoute={initialRoute}
            >
                {children}
            </AllProviders>
        );
    }

    return {
        store,
        queryClient,
        ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };

