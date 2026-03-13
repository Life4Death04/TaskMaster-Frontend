import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TasksContainer } from '../../../src/containers/TasksContainer';
import {
    render,
    createMockTask,
    createInitialState,
    createTestQueryClient,
} from '../test-utils';
import '../setup';

/**
 * Tasks Container Integration Tests
 * Tests the integration between TasksContainer, React Query hooks, Redux, and utility functions
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

// Mock React Query hooks
vi.mock('../../../src/api/queries/tasks.queries', () => ({
    useFetchTasks: vi.fn(),
}));

vi.mock('../../../src/api/queries/settings.queries', () => ({
    useFetchSettings: vi.fn(),
}));

vi.mock('../../../src/api/mutations/tasks.mutations', () => ({
    useToggleTaskStatus: vi.fn(),
}));

import { useFetchTasks } from '../../../src/api/queries/tasks.queries';
import { useFetchSettings } from '../../../src/api/queries/settings.queries';
import { useToggleTaskStatus } from '../../../src/api/mutations/tasks.mutations';

// ============================================================================
// Integration Tests
// ============================================================================

describe('TasksContainer - Integration Tests', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        // Default mock implementations
        vi.mocked(useFetchSettings).mockReturnValue({
            data: { dateFormat: 'MM_DD_YYYY' },
            isLoading: false,
            error: null,
        } as any);

        vi.mocked(useToggleTaskStatus).mockReturnValue({
            mutate: vi.fn(),
            mutateAsync: vi.fn(),
            isPending: false,
        } as any);
    });

    test('should render tasks container with welcome message', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        } as any);

        render(<TasksContainer />);

        // Check for welcome message with user name
        expect(screen.getByText(/My Tasks/i)).toBeInTheDocument();
    });

    test('should display loading state while fetching tasks', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        } as any);

        render(<TasksContainer />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('should render and display tasks from API', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Task 1', status: 'PENDING' }),
            createMockTask({ id: 2, taskName: 'Task 2', status: 'IN_PROGRESS' }),
            createMockTask({ id: 3, taskName: 'Task 3', status: 'DONE' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        render(<TasksContainer />);

        await waitFor(() => {
            expect(screen.getByText('Task 1')).toBeInTheDocument();
            expect(screen.getByText('Task 2')).toBeInTheDocument();
            expect(screen.getByText('Task 3')).toBeInTheDocument();
        });
    });

    test('should filter tasks by status tab', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Pending Task', status: 'PENDING' }),
            createMockTask({ id: 2, taskName: 'In Progress Task', status: 'IN_PROGRESS' }),
            createMockTask({ id: 3, taskName: 'Done Task', status: 'DONE' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<TasksContainer />);

        // Initially all tasks are visible (all tab)
        expect(screen.getByText('Pending Task')).toBeInTheDocument();
        expect(screen.getByText('In Progress Task')).toBeInTheDocument();
        expect(screen.getByText('Done Task')).toBeInTheDocument();

        // Click "In Progress" tab
        const inProgressTab = screen.getByRole('button', { name: /in progress/i });
        await user.click(inProgressTab);

        // Only in-progress task should be visible
        await waitFor(() => {
            expect(screen.queryByText('Pending Task')).not.toBeInTheDocument();
            expect(screen.getByText('In Progress Task')).toBeInTheDocument();
            expect(screen.queryByText('Done Task')).not.toBeInTheDocument();
        });
    });

    test('should filter tasks by search query', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Buy groceries', description: 'Milk and bread' }),
            createMockTask({ id: 2, taskName: 'Write report', description: 'Q4 analysis' }),
            createMockTask({ id: 3, taskName: 'Call dentist', description: 'Schedule appointment' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<TasksContainer />);

        // Find search input
        const searchInput = screen.getByPlaceholderText(/search/i);

        // Type search query
        await user.type(searchInput, 'report');

        // Only matching task should be visible
        await waitFor(() => {
            expect(screen.queryByText('Buy groceries')).not.toBeInTheDocument();
            expect(screen.getByText('Write report')).toBeInTheDocument();
            expect(screen.queryByText('Call dentist')).not.toBeInTheDocument();
        });
    });

    test('should sort tasks by priority', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Low Priority', priority: 'LOW' }),
            createMockTask({ id: 2, taskName: 'High Priority', priority: 'HIGH' }),
            createMockTask({ id: 3, taskName: 'Medium Priority', priority: 'MEDIUM' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<TasksContainer />);

        // Find the sort select dropdown
        const sortSelect = screen.getByRole('combobox');

        // Select priority sort option by value
        await user.selectOptions(sortSelect, 'priority');

        // Tasks should be sorted: HIGH -> MEDIUM -> LOW
        await waitFor(() => {
            const taskElements = screen.getAllByTestId('task-card');
            expect(taskElements[0]).toHaveTextContent('High Priority');
            expect(taskElements[1]).toHaveTextContent('Medium Priority');
            expect(taskElements[2]).toHaveTextContent('Low Priority');
        });
    });

    test('should open create task modal when clicking add button', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        const { store } = render(<TasksContainer />);

        // Click add task button (get first button found to avoid multiple match error)
        const addButtons = screen.getAllByRole('button', { name: /Create Task/i });
        await user.click(addButtons[0]);

        // Check if modal state was updated in Redux
        await waitFor(() => {
            const state = store.getState();
            expect(state.ui.modal.type).toBe('CREATE_TASK');
            expect(state.ui.modal.isOpen).toBe(true);
        });
    });

    test('should handle tasks with overdue status correctly', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const mockTasks = [
            createMockTask({
                id: 1,
                taskName: 'Overdue Task',
                status: 'PENDING',
                dueDate: yesterday.toISOString(),
            }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        render(<TasksContainer />);

        await waitFor(() => {
            const overdueLabel = screen.getByText('OVERDUE');
            expect(overdueLabel.tagName).toBe('SPAN');
            expect(overdueLabel).toBeInTheDocument();
        });
    });

    test('should combine filters and search correctly', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Pending Report', status: 'TODO' }),
            createMockTask({ id: 2, taskName: 'In Progress Report', status: 'IN_PROGRESS' }),
            createMockTask({ id: 3, taskName: 'Pending Email', status: 'TODO' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<TasksContainer />);

        // Click "Pending" tab
        const pendingTab = screen.getByRole('button', { name: /^To Do$/i });
        await user.click(pendingTab);

        // Type search query
        const searchInput = screen.getByPlaceholderText(/search/i);
        await user.type(searchInput, 'report');

        // Only "Pending Report" should match both filters
        await waitFor(() => {
            expect(screen.getByText('Pending Report')).toBeInTheDocument();
            expect(screen.queryByText('In Progress Report')).not.toBeInTheDocument();
            expect(screen.queryByText('Pending Email')).not.toBeInTheDocument();
        });
    });

    test('should display empty state when no tasks match filters', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Task 1', status: 'PENDING' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<TasksContainer />);

        // Search for non-existent task
        const searchInput = screen.getByPlaceholderText(/search/i);
        await user.type(searchInput, 'nonexistent task');

        await waitFor(() => {
            expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
        });
    });
});
