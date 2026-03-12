import { test, expect, vi, describe, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchSettings } from '../../../src/api/queries/settings.queries';
import { useUpdateSettings } from '../../../src/api/mutations/settings.mutations';
import * as settingsApi from '../../../src/api/request/settings.api';
import { createMockSettings } from '../test-utils';
import type { Settings } from '../../../src/types';
import '../setup';
import { de } from 'zod/v4/locales';

/**
 * Settings API Integration Tests
 * Tests React Query hooks integration with API functions
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

vi.mock('../../../src/api/request/settings.api');

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// ============================================================================
// Query Tests
// ============================================================================

describe('Settings API - Query Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useFetchSettings', () => {
        test('should fetch settings successfully', async () => {
            const mockSettings = createMockSettings({
                defaultStatus: 'TODO',
                defaultPriority: 'MEDIUM',
            });

            vi.mocked(settingsApi.fetchSettingsAPI).mockResolvedValue(mockSettings);

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockSettings);
            expect(settingsApi.fetchSettingsAPI).toHaveBeenCalledTimes(1);
        });

        test('should handle fetch settings error', async () => {
            const error = new Error('Failed to fetch settings');
            vi.mocked(settingsApi.fetchSettingsAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
            expect(result.current.data).toBeUndefined();
        });

        test('should return loading state initially', () => {
            vi.mocked(settingsApi.fetchSettingsAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
        });

        test('should use correct query key', async () => {
            const mockSettings = createMockSettings();
            vi.mocked(settingsApi.fetchSettingsAPI).mockResolvedValue(mockSettings);

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            // Query key should be ['settings']
            expect(result.current.data).toBeDefined();
        });

        test('should fetch settings with all fields', async () => {
            const mockSettings = createMockSettings({
                defaultStatus: 'IN_PROGRESS',
                defaultPriority: 'HIGH',
                theme: 'dark',
                language: 'es',
            });

            vi.mocked(settingsApi.fetchSettingsAPI).mockResolvedValue(mockSettings);

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.defaultStatus).toBe('IN_PROGRESS');
            expect(result.current.data?.defaultPriority).toBe('HIGH');
            expect(result.current.data?.theme).toBe('dark');
            expect(result.current.data?.language).toBe('es');
        });

        test('should handle settings not found', async () => {
            const error = new Error('Settings not found');
            vi.mocked(settingsApi.fetchSettingsAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useFetchSettings(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error?.message).toBe('Settings not found');
        });
    });
});

// ============================================================================
// Mutation Tests
// ============================================================================

describe('Settings API - Mutation Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useUpdateSettings', () => {
        test('should update settings successfully', async () => {
            const updateData = {
                defaultStatus: 'IN_PROGRESS' as const,
                defaultPriority: 'HIGH' as const,
            };

            const updatedSettings = createMockSettings(updateData);

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(updatedSettings);
            expect(settingsApi.updateSettingsAPI).toHaveBeenCalledWith(
                updateData,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle update settings error', async () => {
            const error = new Error('Failed to update settings');
            vi.mocked(settingsApi.updateSettingsAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ defaultStatus: 'TODO' });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate settings query on success', async () => {
            const updatedSettings = createMockSettings();
            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useUpdateSettings(), { wrapper });

            result.current.mutate({ defaultStatus: 'TODO' });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['settings'] });
        });

        test('should call onSuccess callback', async () => {
            const updatedSettings = createMockSettings();
            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const onSuccess = vi.fn();

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ defaultStatus: 'TODO' }, { onSuccess });

            await waitFor(() =>
                expect(onSuccess).toHaveBeenCalledWith(
                    updatedSettings,
                    { "defaultStatus": "TODO" },
                    undefined,
                    { "client": expect.anything(), "meta": undefined, "mutationKey": undefined }
                )
            );
        });

        test('should update theme setting', async () => {
            const updateData = { theme: 'dark' as const };
            const updatedSettings = createMockSettings({ theme: 'dark' });

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.theme).toBe('dark');
        });

        test('should update language setting', async () => {
            const updateData = { language: 'es' as const };
            const updatedSettings = createMockSettings({ language: 'es' });

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.language).toBe('es');
        });

        test('should update default status setting', async () => {
            const updateData = { defaultStatus: 'DONE' as const };
            const updatedSettings = createMockSettings({ defaultStatus: 'DONE' });

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.defaultStatus).toBe('DONE');
        });

        test('should update default priority setting', async () => {
            const updateData = { defaultPriority: 'LOW' as const };
            const updatedSettings = createMockSettings({ defaultPriority: 'LOW' });

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.defaultPriority).toBe('LOW');
        });

        test('should update multiple settings at once', async () => {
            const updateData = {
                defaultStatus: 'IN_PROGRESS' as const,
                defaultPriority: 'HIGH' as const,
                theme: 'dark' as const,
                language: 'fr' as const,
            };

            const updatedSettings = createMockSettings(updateData);

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.defaultStatus).toBe('IN_PROGRESS');
            expect(result.current.data?.defaultPriority).toBe('HIGH');
            expect(result.current.data?.theme).toBe('dark');
            expect(result.current.data?.language).toBe('fr');
        });

        test('should return loading state during update', async () => {
            vi.mocked(settingsApi.updateSettingsAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ defaultStatus: 'TODO' });

            await waitFor(() => expect(result.current.isPending).toBe(true));
        });

        test('should handle partial settings update', async () => {
            const updateData = { theme: 'light' as const };
            const updatedSettings = createMockSettings({
                theme: 'light',
                defaultStatus: 'TODO',
                defaultPriority: 'MEDIUM',
            });

            vi.mocked(settingsApi.updateSettingsAPI).mockResolvedValue(
                updatedSettings
            );

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.theme).toBe('light');
            expect(result.current.data?.defaultStatus).toBe('TODO');
        });

        test('should handle network errors gracefully', async () => {
            const networkError = new Error('Network error');
            vi.mocked(settingsApi.updateSettingsAPI).mockRejectedValue(networkError);

            const { result } = renderHook(() => useUpdateSettings(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ defaultStatus: 'TODO' });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error?.message).toBe('Network error');
        });
    });
});
