import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTaskModal } from '../../../src/components/Modals/CreateTaskModal';
import { render, createMockSettings, createMockList } from '../test-utils';
import '../setup';

/**
 * CreateTaskModal Integration Tests
 * Tests the integration between CreateTaskModal, React Hook Form, validation, and user interactions
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

// Mock React Query hooks
vi.mock('../../../src/api/queries/settings.queries', () => ({
    useFetchSettings: vi.fn(),
}));

vi.mock('../../../src/api/queries/lists.queries', () => ({
    useFetchLists: vi.fn(),
}));

import { useFetchSettings } from '../../../src/api/queries/settings.queries';
import { useFetchLists } from '../../../src/api/queries/lists.queries';

// ============================================================================
// Integration Tests
// ============================================================================

describe('CreateTaskModal - Integration Tests', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock for settings
        vi.mocked(useFetchSettings).mockReturnValue({
            data: createMockSettings(),
        } as any);

        // Default mock for lists
        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
        } as any);
    });

    test('should render modal when open', () => {
        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByRole('heading', { name: /create new task/i })).toBeInTheDocument();
    });

    test('should not render modal when closed', () => {
        render(
            <CreateTaskModal
                isOpen={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.queryByRole('heading', { name: /create task/i })).not.toBeInTheDocument();
    });

    test('should display form fields', () => {
        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(container.querySelector('input[name="taskName"]')).toBeInTheDocument();
        expect(container.querySelector('textarea[name="description"]')).toBeInTheDocument();

        // Status select with options
        const statusSelect = container.querySelector('select[name="status"]');
        expect(statusSelect).toBeInTheDocument();
        expect(statusSelect?.querySelector('option[value="TODO"]')).toBeInTheDocument();
        expect(statusSelect?.querySelector('option[value="IN_PROGRESS"]')).toBeInTheDocument();
        expect(statusSelect?.querySelector('option[value="DONE"]')).toBeInTheDocument();

        // Priority buttons
        expect(screen.getByRole('button', { name: /low/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /med/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument();

        expect(container.querySelector('input[name="dueDate"]')).toBeInTheDocument();
    });

    test('should close modal when close button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should submit form with valid data', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill out form
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;

        await user.type(taskNameInput, 'New Task');
        await user.type(descriptionInput, 'Task description');

        // Submit form
        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    taskName: 'New Task',
                    description: 'Task description',
                })
            );
        });
    });

    test('should validate required task name field', async () => {
        const user = userEvent.setup();

        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Try to submit without task name
        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/task name is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should use default status from settings', () => {
        vi.mocked(useFetchSettings).mockReturnValue({
            data: createMockSettings({ defaultStatus: 'IN_PROGRESS' }),
        } as any);

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        expect(statusSelect.value).toBe('IN_PROGRESS');
    });

    test('should use default priority from settings', () => {
        vi.mocked(useFetchSettings).mockReturnValue({
            data: createMockSettings({ defaultPriority: 'HIGH' }),
        } as any);

        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const highPriorityButton = screen.getByRole('button', { name: /high/i });
        expect(highPriorityButton).toHaveClass('bg-red-500/20 text-red-400');
    });

    test('should display lists dropdown when lists are available', () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work' }),
            createMockList({ id: 2, title: 'Personal' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
        } as any);

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const listSelect = container.querySelector('select[name="listId"]');
        expect(listSelect).toBeInTheDocument();
    });

    test('should not preselect list when defaultListId is provided', () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work' }),
            createMockList({ id: 2, title: 'Personal' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
        } as any);

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                defaultListId={2}
            />
        );

        const listSelect = container.querySelector('select[name="listId"]') as HTMLSelectElement;
        expect(listSelect.value).toBe('');
    });

    test('should change priority when priority button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const highPriorityButton = screen.getByRole('button', { name: /high/i });
        await user.click(highPriorityButton);

        expect(highPriorityButton).toHaveClass('bg-red-500/20 text-red-400');
    });

    test('should accept due date input', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;
        await user.type(dueDateInput, '2026-12-31');

        expect(dueDateInput.value).toBe('2026-12-31');
    });

    test('should show loading state when isLoading is true', () => {
        render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                isLoading={true}
            />
        );

        const submitButton = screen.getByRole('button', { name: /creating/i });
        expect(submitButton).toBeDisabled();
    });

    test('should reset form on close', async () => {
        const user = userEvent.setup();

        const { rerender, container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill out form
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        await user.type(taskNameInput, 'Test Task');

        // Close modal
        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        // Reopen modal
        rerender(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Form should be reset
        const taskNameInputAfter = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        expect(taskNameInputAfter.value).toBe('');
    });

    test('should handle status selection', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        await user.selectOptions(statusSelect, 'DONE');

        expect(statusSelect.value).toBe('DONE');
    });

    test('should submit with all form fields populated', async () => {
        const user = userEvent.setup();

        const mockLists = [createMockList({ id: 1, title: 'Work' })];
        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
        } as any);

        const { container } = render(
            <CreateTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill all fields
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        const highPriorityButton = screen.getByRole('button', { name: /high/i });
        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;
        const listSelect = container.querySelector('select[name="listId"]') as HTMLSelectElement;

        await user.type(taskNameInput, 'Complete Task');
        await user.type(descriptionInput, 'Full description');
        await user.selectOptions(statusSelect, 'IN_PROGRESS');
        await user.click(highPriorityButton);
        await user.type(dueDateInput, '2026-12-31');
        await user.selectOptions(listSelect, '1');

        // Submit
        const submitButton = screen.getByRole('button', { name: /create task/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                taskName: 'Complete Task',
                description: 'Full description',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                dueDate: '2026-12-31',
                listId: 1,
            });
        });
    });
});
