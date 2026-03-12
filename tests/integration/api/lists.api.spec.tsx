import { test, expect, vi, describe, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useFetchLists,
    useGetListById,
} from '../../../src/api/queries/lists.queries';
import {
    useCreateList,
    useUpdateList,
    useDeleteList,
    useToggleListFavorite,
} from '../../../src/api/mutations/lists.mutations';
import * as listsApi from '../../../src/api/request/lists.api';
import { createMockList } from '../test-utils';
import type { List } from '../../../src/types';
import '../setup';

/**
 * Lists API Integration Tests
 * Tests React Query hooks integration with API functions
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

vi.mock('../../../src/api/request/lists.api');

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

describe('Lists API - Query Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useFetchLists', () => {
        test('should fetch all lists successfully', async () => {
            const mockLists = [
                createMockList({ id: 1, title: 'Work' }),
                createMockList({ id: 2, title: 'Personal' }),
            ];

            vi.mocked(listsApi.fetchListsAPI).mockResolvedValue(mockLists);

            const { result } = renderHook(() => useFetchLists(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockLists);
            expect(listsApi.fetchListsAPI).toHaveBeenCalledTimes(1);
        });

        test('should handle fetch lists error', async () => {
            const error = new Error('Failed to fetch lists');
            vi.mocked(listsApi.fetchListsAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useFetchLists(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
            expect(result.current.data).toBeUndefined();
        });

        test('should return loading state initially', () => {
            vi.mocked(listsApi.fetchListsAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useFetchLists(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
        });

        test('should use correct query key', async () => {
            const mockLists: List[] = [];
            vi.mocked(listsApi.fetchListsAPI).mockResolvedValue(mockLists);

            const { result } = renderHook(() => useFetchLists(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toBeDefined();
        });

        test('should fetch empty lists array', async () => {
            vi.mocked(listsApi.fetchListsAPI).mockResolvedValue([]);

            const { result } = renderHook(() => useFetchLists(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual([]);
        });
    });

    describe('useGetListById', () => {
        test('should fetch list by id successfully', async () => {
            const mockList = createMockList({ id: 1, title: 'Work Tasks' });

            vi.mocked(listsApi.getListByIdAPI).mockResolvedValue(mockList);

            const { result } = renderHook(() => useGetListById(1), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockList);
            expect(listsApi.getListByIdAPI).toHaveBeenCalledWith(1);
        });

        test('should handle list not found error', async () => {
            const error = new Error('List not found');
            vi.mocked(listsApi.getListByIdAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useGetListById(999), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should not fetch when listId is 0', () => {
            const { result } = renderHook(() => useGetListById(0), {
                wrapper: createWrapper(),
            });

            expect(result.current.isPending).toBe(true);
            expect(result.current.fetchStatus).toBe('idle');
            expect(listsApi.getListByIdAPI).not.toHaveBeenCalled();
        });

        test('should fetch list with tasks', async () => {
            const mockList = createMockList({
                id: 1,
                title: 'Project',
                tasks: [{ id: 1, taskName: 'Task 1' }],
            });

            vi.mocked(listsApi.getListByIdAPI).mockResolvedValue(mockList as any);

            const { result } = renderHook(() => useGetListById(1), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.tasks).toBeDefined();
        });
    });
});

// ============================================================================
// Mutation Tests
// ============================================================================

describe('Lists API - Mutation Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useCreateList', () => {
        test('should create list successfully', async () => {
            const newListData = {
                title: 'New List',
                description: 'Description',
                color: '#FF0000',
            };

            const createdList = createMockList({ id: 1, ...newListData });

            vi.mocked(listsApi.createListAPI).mockResolvedValue(createdList);

            const { result } = renderHook(() => useCreateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(newListData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(createdList);
            expect(listsApi.createListAPI).toHaveBeenCalledWith(
                newListData,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle create list error', async () => {
            const error = new Error('Failed to create list');
            vi.mocked(listsApi.createListAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useCreateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ title: 'List', color: '#FF0000' });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate lists query on success', async () => {
            const createdList = createMockList({ id: 1 });
            vi.mocked(listsApi.createListAPI).mockResolvedValue(createdList);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useCreateList(), { wrapper });

            result.current.mutate({ title: 'List', color: '#FF0000' });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
        });

        test('should call onSuccess callback', async () => {
            const createdList = createMockList({ id: 1 });
            vi.mocked(listsApi.createListAPI).mockResolvedValue(createdList);

            const onSuccess = vi.fn();

            const { result } = renderHook(() => useCreateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(
                { title: 'List', color: '#FF0000' },
                { onSuccess }
            );

            await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(
                createdList,
                { "color": "#FF0000", "title": "List", },
                undefined,
                { "client": expect.anything(), "meta": undefined, "mutationKey": undefined }
            ));
        });

        test('should create list with optional fields', async () => {
            const listData = { title: 'Simple List' };
            const createdList = createMockList({ id: 1, title: 'Simple List' });

            vi.mocked(listsApi.createListAPI).mockResolvedValue(createdList);

            const { result } = renderHook(() => useCreateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(listData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(listsApi.createListAPI).toHaveBeenCalledWith(
                listData,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });
    });

    describe('useUpdateList', () => {
        test('should update list successfully', async () => {
            const updateData = {
                id: 1,
                data: { title: 'Updated List', description: 'New description' },
            };

            const updatedList = createMockList({ id: 1, ...updateData.data });

            vi.mocked(listsApi.updateListAPI).mockResolvedValue(updatedList);

            const { result } = renderHook(() => useUpdateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(updatedList);
            expect(listsApi.updateListAPI).toHaveBeenCalledWith(
                updateData
            );
        });

        test('should handle update list error', async () => {
            const error = new Error('Failed to update list');
            vi.mocked(listsApi.updateListAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useUpdateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ id: 1, data: { title: 'Updated' } });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate lists queries on success', async () => {
            const updatedList = createMockList({ id: 1 });
            vi.mocked(listsApi.updateListAPI).mockResolvedValue(updatedList);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useUpdateList(), { wrapper });

            result.current.mutate({ id: 1, data: { title: 'Updated' } });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists', 1] });
        });

        test('should update list color', async () => {
            const updateData = { id: 1, data: { color: '#00FF00' } };
            const updatedList = createMockList({ id: 1, color: '#00FF00' });

            vi.mocked(listsApi.updateListAPI).mockResolvedValue(updatedList);

            const { result } = renderHook(() => useUpdateList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.color).toBe('#00FF00');
        });
    });

    describe('useDeleteList', () => {
        test('should delete list successfully', async () => {
            vi.mocked(listsApi.deleteListAPI).mockResolvedValue(undefined);

            const { result } = renderHook(() => useDeleteList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(listsApi.deleteListAPI).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle delete list error', async () => {
            const error = new Error('Failed to delete list');
            vi.mocked(listsApi.deleteListAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useDeleteList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate lists queries on success', async () => {
            vi.mocked(listsApi.deleteListAPI).mockResolvedValue(undefined);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useDeleteList(), { wrapper });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
        });

        test('should call onSuccess callback after deletion', async () => {
            vi.mocked(listsApi.deleteListAPI).mockResolvedValue(undefined);

            const onSuccess = vi.fn();

            const { result } = renderHook(() => useDeleteList(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1, { onSuccess });

            await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        });
    });

    describe('useToggleListFavorite', () => {
        test('should toggle list favorite successfully', async () => {
            const toggledList = createMockList({ id: 1, isFavorite: true });

            vi.mocked(listsApi.toggleListFavoriteAPI).mockResolvedValue(toggledList);

            const { result } = renderHook(() => useToggleListFavorite(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(toggledList);
            expect(listsApi.toggleListFavoriteAPI).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle toggle favorite error', async () => {
            const error = new Error('Failed to toggle favorite');
            vi.mocked(listsApi.toggleListFavoriteAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useToggleListFavorite(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate lists queries on success', async () => {
            const toggledList = createMockList({ id: 1, isFavorite: true });
            vi.mocked(listsApi.toggleListFavoriteAPI).mockResolvedValue(toggledList);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useToggleListFavorite(), { wrapper });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists', 1] });
        });

        test('should return loading state during toggle', async () => {
            vi.mocked(listsApi.toggleListFavoriteAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useToggleListFavorite(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isPending).toBe(true));
        });

        test('should toggle favorite from true to false', async () => {
            const toggledList = createMockList({ id: 1, isFavorite: false });

            vi.mocked(listsApi.toggleListFavoriteAPI).mockResolvedValue(toggledList);

            const { result } = renderHook(() => useToggleListFavorite(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data?.isFavorite).toBe(false);
        });
    });
});
