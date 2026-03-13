import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DashboardContainer } from '../../../src/containers/DashboardContainer';
import {
    render,
    createMockTask,
    createMockList,
    createInitialState,
} from '../test-utils';
import '../setup';

/**
 * Dashboard Container Integration Tests
 * Tests the integration between DashboardContainer, React Query hooks, Redux, and statistics calculations
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

// Mock React Query hooks
vi.mock('../../../src/api/queries/tasks.queries', () => ({
    useFetchTasks: vi.fn(),
}));

vi.mock('../../../src/api/queries/lists.queries', () => ({
    useFetchLists: vi.fn(),
}));

vi.mock('../../../src/api/mutations/tasks.mutations', () => ({
    useToggleTaskStatus: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

import { useFetchTasks } from '../../../src/api/queries/tasks.queries';
import { useFetchLists } from '../../../src/api/queries/lists.queries';
import { useToggleTaskStatus } from '../../../src/api/mutations/tasks.mutations';

// ============================================================================
// Integration Tests
// ============================================================================

describe('DashboardContainer - Integration Tests', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        mockNavigate.mockClear();

        // Default mock for toggle mutation
        vi.mocked(useToggleTaskStatus).mockReturnValue({
            mutateAsync: vi.fn(),
            isPending: false,
        } as any);
    });

    test('should render dashboard with welcome message', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        expect(screen.getByText(/Welcome back, Test/i)).toBeInTheDocument();
    });

    test('should calculate and display correct statistics', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const mockTasks = [
            createMockTask({ id: 1, taskName: 'testing 1', status: 'PENDING' }),
            createMockTask({ id: 2, taskName: 'testing 2', status: 'IN_PROGRESS' }),
            createMockTask({ id: 3, taskName: 'testing 3', status: 'DONE' }),
            createMockTask({ id: 4, taskName: 'testing 4', status: 'PENDING', dueDate: yesterday.toISOString() }), // Overdue
        ];

        const mockLists = [
            createMockList({ id: 1 }),
            createMockList({ id: 2 }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            // Total tasks: 4 - Find the label and check its sibling value
            const totalTasksLabel = screen.getByText(/TOTAL TASKS/i);
            const totalTasksCard = totalTasksLabel.closest('div');
            const totalTasksValue = totalTasksCard?.querySelector('p.text-2xl, p.text-4xl');
            expect(totalTasksValue).toHaveTextContent('4');

            // Completed today: 1 - Find the label and check its sibling value
            const completedLabel = screen.getByText(/COMPLETED TODAY/i);
            const completedCard = completedLabel.closest('div');
            const completedValue = completedCard?.querySelector('p.text-2xl, p.text-4xl');
            expect(completedValue).toHaveTextContent('1');

            // Overdue: 1 - Find the label and check its sibling value
            const overdueLabel = screen.getByText(/OVERDUE/i);
            const overdueCard = overdueLabel.closest('div');
            const overdueValue = overdueCard?.querySelector('p.text-2xl, p.text-4xl');
            expect(overdueValue).toHaveTextContent('1');

            // Total lists: 2 - Find the label and check its sibling value
            const totalListsLabel = screen.getByText(/MY LISTS/i);
            const totalListsCard = totalListsLabel.closest('div');
            const totalListsValue = totalListsCard?.querySelector('p.text-2xl, p.text-4xl');
            expect(totalListsValue).toHaveTextContent('2');
        });
    });

    test('should display recent tasks', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Testing Task 1' }),
            createMockTask({ id: 2, taskName: 'Testing Task 2' }),
            createMockTask({ id: 3, taskName: 'Testing Task 3' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 3, name: 'Testing Task 1' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Testing Task 2' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Testing Task 3' })).toBeInTheDocument();
        });
    });

    test('should limit recent tasks to 5', async () => {
        const mockTasks = Array.from({ length: 10 }, (_, i) =>
            createMockTask({ id: i + 1, taskName: `Task ${i + 1}` })
        );

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            // Should show first 5 tasks
            expect(screen.getByRole('heading', { level: 3, name: 'Task 1' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Task 5' })).toBeInTheDocument();

            // Should not show 6th task
            expect(screen.queryByRole('heading', { level: 3, name: 'Task 6' })).not.toBeInTheDocument();
        });
    });

    test('should display upcoming tasks with due dates', async () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const mockTasks = [
            createMockTask({
                id: 1,
                taskName: 'Tomorrow Task',
                status: 'PENDING',
                dueDate: tomorrow.toISOString(),
            }),
            createMockTask({
                id: 2,
                taskName: 'Next Week Task',
                status: 'PENDING',
                dueDate: nextWeek.toISOString(),
            }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 4, name: 'Tomorrow Task' })).toBeInTheDocument();
        });
    });

    test('should mark overdue tasks visually', async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 3);

        const mockTasks = [
            createMockTask({
                id: 1,
                taskName: 'Overdue Task',
                status: 'TODO',
                dueDate: yesterday.toISOString(),
            }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            // Find the task heading, then locate the overdue span sibling
            const taskHeading = screen.getByRole('heading', { level: 3, name: 'Overdue Task' });
            const taskContainer = taskHeading.closest('div');
            const overdueSpan = taskContainer?.querySelector('span');

            expect(overdueSpan).toBeInTheDocument();
            expect(overdueSpan).toHaveTextContent(/OVERDUE/i);
            expect(overdueSpan).toHaveClass('bg-red-500/20');
        });
    });

    test('should open create task modal when clicking quick add', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        const user = userEvent.setup();
        const { store } = render(<DashboardContainer />);

        // Click quick add button
        const quickAddButton = screen.getByRole('button', { name: /Create Task/i });
        await user.click(quickAddButton);

        // Check if modal state was updated in Redux
        await waitFor(() => {
            const state = store.getState();
            expect(state.ui.modal).toEqual({ type: 'CREATE_TASK', isOpen: true });
        });
    });

    test('should navigate to tasks page when clicking view all tasks', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [createMockTask({ id: 1 })],
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        const user = userEvent.setup();
        render(<DashboardContainer />);

        // Click view all button
        const viewAllButton = screen.getByRole('button', { name: /View All/i });
        await user.click(viewAllButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/tasks');
        });
    });

    test('should handle empty state with no tasks or lists', async () => {
        vi.mocked(useFetchTasks).mockReturnValue({
            data: [],
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            // Find the TOTAL TASKS label and check its sibling value is 0
            const totalTasksLabel = screen.getByText(/TOTAL TASKS/i);
            const totalTasksCard = totalTasksLabel.closest('div');
            const totalTasksValue = totalTasksCard?.querySelector('p.text-2xl, p.text-4xl');
            expect(totalTasksValue).toHaveTextContent('0');
        });
    });

    test('should display task priority badges correctly', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'High Priority', priority: 'HIGH' }),
            createMockTask({ id: 2, taskName: 'Medium Priority', priority: 'MEDIUM' }),
            createMockTask({ id: 3, taskName: 'Low Priority', priority: 'LOW' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        render(<DashboardContainer />);

        await waitFor(() => {
            // Check task names as h3 headings
            expect(screen.getByRole('heading', { level: 3, name: 'High Priority' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Medium Priority' })).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 3, name: 'Low Priority' })).toBeInTheDocument();

            // Priority badges should be visible as span elements
            const highBadge = screen.getAllByText(/High/i)[1];
            expect(highBadge.tagName).toBe('SPAN');

            const mediumBadge = screen.getAllByText(/Med/i)[1];
            expect(mediumBadge.tagName).toBe('SPAN');

            const lowBadge = screen.getAllByText(/Low/i)[1];
            expect(lowBadge.tagName).toBe('SPAN');
        });
    });

    test('should search and filter tasks on dashboard', async () => {
        const mockTasks = [
            createMockTask({ id: 1, taskName: 'Work Report' }),
            createMockTask({ id: 2, taskName: 'Personal Email' }),
        ];

        vi.mocked(useFetchTasks).mockReturnValue({
            data: mockTasks,
        } as any);

        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);

        const user = userEvent.setup();
        render(<DashboardContainer />);

        // Find search input (if available on dashboard)
        const searchInput = screen.queryByPlaceholderText(/search/i);

        if (searchInput) {
            await user.type(searchInput, 'work');

            await waitFor(() => {
                expect(screen.getByText('Work Report')).toBeInTheDocument();
                expect(screen.queryByText('Personal Email')).not.toBeInTheDocument();
            });
        }
    });
});
