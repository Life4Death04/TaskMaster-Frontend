import { test, expect, vi, describe, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    useFetchTasks,
    useGetTaskById,
} from '../../../src/api/queries/tasks.queries';
import {
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useToggleTaskStatus,
} from '../../../src/api/mutations/tasks.mutations';
import * as tasksApi from '../../../src/api/request/tasks.api';
import { createMockTask } from '../test-utils';
import type { Task } from '../../../src/types';
import '../setup';

/**
 * Tasks API Integration Tests
 * Tests React Query hooks integration with API functions
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

vi.mock('../../../src/api/request/tasks.api');

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

describe('Tasks API - Query Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useFetchTasks', () => {
        test('should fetch all tasks successfully', async () => {
            const mockTasks = [
                createMockTask({ id: 1, taskName: 'Task 1' }),
                createMockTask({ id: 2, taskName: 'Task 2' }),
            ];

            vi.mocked(tasksApi.fetchTasksAPI).mockResolvedValue(mockTasks);

            const { result } = renderHook(() => useFetchTasks(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockTasks);
            expect(tasksApi.fetchTasksAPI).toHaveBeenCalledTimes(1);
        });

        test('should handle fetch tasks error', async () => {
            const error = new Error('Failed to fetch tasks');
            vi.mocked(tasksApi.fetchTasksAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useFetchTasks(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
            expect(result.current.data).toBeUndefined();
        });

        test('should return loading state initially', () => {
            vi.mocked(tasksApi.fetchTasksAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useFetchTasks(), {
                wrapper: createWrapper(),
            });

            expect(result.current.isLoading).toBe(true);
            expect(result.current.data).toBeUndefined();
        });

        test('should use correct query key', async () => {
            const mockTasks: Task[] = [];
            vi.mocked(tasksApi.fetchTasksAPI).mockResolvedValue(mockTasks);

            const { result } = renderHook(() => useFetchTasks(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            // Query key should be ['tasks']
            expect(result.current.data).toBeDefined();
        });
    });

    describe('useGetTaskById', () => {
        test('should fetch task by id successfully', async () => {
            const mockTask = createMockTask({ id: 1, taskName: 'Specific Task' });

            vi.mocked(tasksApi.getTaskByIdAPI).mockResolvedValue(mockTask);

            const { result } = renderHook(() => useGetTaskById(1), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockTask);
            expect(tasksApi.getTaskByIdAPI).toHaveBeenCalledWith(1);
        });

        test('should handle task not found error', async () => {
            const error = new Error('Task not found');
            vi.mocked(tasksApi.getTaskByIdAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useGetTaskById(999), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should not fetch when taskId is 0', () => {
            const { result } = renderHook(() => useGetTaskById(0), {
                wrapper: createWrapper(),
            });

            expect(result.current.isPending).toBe(true);
            expect(result.current.fetchStatus).toBe('idle');
            expect(tasksApi.getTaskByIdAPI).not.toHaveBeenCalled();
        });

        test('should use correct query key with taskId', async () => {
            const mockTask = createMockTask({ id: 5 });
            vi.mocked(tasksApi.getTaskByIdAPI).mockResolvedValue(mockTask);

            const { result } = renderHook(() => useGetTaskById(5), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(tasksApi.getTaskByIdAPI).toHaveBeenCalledWith(5);
        });
    });
});

// ============================================================================
// Mutation Tests
// ============================================================================

describe('Tasks API - Mutation Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useCreateTask', () => {
        test('should create task successfully', async () => {
            const newTaskData = {
                taskName: 'New Task',
                description: 'Description',
                status: 'TODO' as const,
                priority: 'MEDIUM' as const,
            };

            const createdTask = createMockTask({ id: 1, ...newTaskData });

            vi.mocked(tasksApi.createTaskAPI).mockResolvedValue(createdTask);

            const { result } = renderHook(() => useCreateTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(newTaskData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(createdTask);
            expect(tasksApi.createTaskAPI).toHaveBeenCalledWith(
                newTaskData,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle create task error', async () => {
            const error = new Error('Failed to create task');
            vi.mocked(tasksApi.createTaskAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useCreateTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({
                taskName: 'Task',
                status: 'TODO',
                priority: 'MEDIUM',
            });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate tasks query on success', async () => {
            const createdTask = createMockTask({ id: 1 });
            vi.mocked(tasksApi.createTaskAPI).mockResolvedValue(createdTask);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useCreateTask(), { wrapper });

            result.current.mutate({
                taskName: 'Task',
                status: 'TODO',
                priority: 'MEDIUM',
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
        });
    });

    describe('useUpdateTask', () => {
        test('should update task successfully', async () => {
            const updateData = {
                id: 1,
                data: { taskName: 'Updated Task', status: 'DONE' as const },
            };

            const updatedTask = createMockTask({ id: 1, ...updateData.data });

            vi.mocked(tasksApi.updateTaskAPI).mockResolvedValue(updatedTask);

            const { result } = renderHook(() => useUpdateTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(updateData);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(updatedTask);
            expect(tasksApi.updateTaskAPI).toHaveBeenCalledWith(updateData);
        });

        test('should handle update task error', async () => {
            const error = new Error('Failed to update task');
            vi.mocked(tasksApi.updateTaskAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useUpdateTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate({ id: 1, data: { taskName: 'Updated' } });

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate tasks queries on success', async () => {
            const updatedTask = createMockTask({ id: 1 });
            vi.mocked(tasksApi.updateTaskAPI).mockResolvedValue(updatedTask);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useUpdateTask(), { wrapper });

            result.current.mutate({ id: 1, data: { taskName: 'Updated' } });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks', 1] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
        });
    });

    describe('useDeleteTask', () => {
        test('should delete task successfully', async () => {
            vi.mocked(tasksApi.deleteTaskAPI).mockResolvedValue(undefined);

            const { result } = renderHook(() => useDeleteTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(tasksApi.deleteTaskAPI).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle delete task error', async () => {
            const error = new Error('Failed to delete task');
            vi.mocked(tasksApi.deleteTaskAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useDeleteTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate tasks queries on success', async () => {
            vi.mocked(tasksApi.deleteTaskAPI).mockResolvedValue(undefined);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useDeleteTask(), { wrapper });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
        });

        test('should call onSuccess callback after deletion', async () => {
            vi.mocked(tasksApi.deleteTaskAPI).mockResolvedValue(undefined);

            const onSuccess = vi.fn();

            const { result } = renderHook(() => useDeleteTask(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1, { onSuccess });

            await waitFor(() => expect(onSuccess).toHaveBeenCalled());
        });
    });

    describe('useToggleTaskStatus', () => {
        test('should toggle task status successfully', async () => {
            const toggledTask = createMockTask({ id: 1, status: 'DONE' });

            vi.mocked(tasksApi.toggleTaskStatusAPI).mockResolvedValue(toggledTask);

            const { result } = renderHook(() => useToggleTaskStatus(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(toggledTask);
            expect(tasksApi.toggleTaskStatusAPI).toHaveBeenCalledWith(
                1,
                expect.objectContaining({
                    client: expect.anything(),
                    meta: undefined,
                })
            );
        });

        test('should handle toggle status error', async () => {
            const error = new Error('Failed to toggle status');
            vi.mocked(tasksApi.toggleTaskStatusAPI).mockRejectedValue(error);

            const { result } = renderHook(() => useToggleTaskStatus(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isError).toBe(true));

            expect(result.current.error).toEqual(error);
        });

        test('should invalidate tasks queries on success', async () => {
            const toggledTask = createMockTask({ id: 1 });
            vi.mocked(tasksApi.toggleTaskStatusAPI).mockResolvedValue(toggledTask);

            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });
            const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

            const wrapper = ({ children }: { children: React.ReactNode }) => (
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            );

            const { result } = renderHook(() => useToggleTaskStatus(), { wrapper });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks', 1] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['lists'] });
        });

        test('should return loading state during toggle', async () => {
            vi.mocked(tasksApi.toggleTaskStatusAPI).mockImplementation(
                () => new Promise(() => { })
            );

            const { result } = renderHook(() => useToggleTaskStatus(), {
                wrapper: createWrapper(),
            });

            result.current.mutate(1);

            await waitFor(() => expect(result.current.isPending).toBe(true));
        });
    });
});
