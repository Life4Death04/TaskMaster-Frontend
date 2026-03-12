import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditTaskModal } from '../../../src/components/Modals/EditTaskModal';
import { render, createMockTask, createMockList } from '../test-utils';
import '../setup';

/**
 * EditTaskModal Integration Tests
 * Tests the integration between EditTaskModal, React Hook Form, prepopulated data, and validation
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

// Mock React Query hooks
vi.mock('../../../src/api/queries/lists.queries', () => ({
    useFetchLists: vi.fn(),
}));

import { useFetchLists } from '../../../src/api/queries/lists.queries';

// ============================================================================
// Integration Tests
// ============================================================================

describe('EditTaskModal - Integration Tests', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    const mockTask = createMockTask({
        id: 1,
        taskName: 'Existing Task',
        description: 'Existing description',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: '2026-12-31',
        listId: 1,
    });

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock for lists
        vi.mocked(useFetchLists).mockReturnValue({
            data: [
                createMockList({ id: 1, title: 'Work' }),
                createMockList({ id: 2, title: 'Personal' }),
            ],
        } as any);
    });

    test('should render modal when open with task data', () => {
        render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        expect(screen.getByRole('heading', { name: /edit task/i })).toBeInTheDocument();
    });

    test('should not render modal when closed', () => {
        render(
            <EditTaskModal
                isOpen={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        expect(screen.queryByRole('heading', { name: /edit task/i })).not.toBeInTheDocument();
    });

    test('should prepopulate form with task data', () => {
        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        const prioritySelect = screen.getByRole('button', { name: /high/i }) as HTMLButtonElement;
        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;

        expect(taskNameInput.value).toBe('Existing Task');
        expect(descriptionInput.value).toBe('Existing description');
        expect(statusSelect.value).toBe('IN_PROGRESS');
        expect(prioritySelect).toHaveTextContent(/high/i);
        expect(dueDateInput.value).toBe('2026-12-31');
    });

    test('should close modal when close button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should submit form with updated data', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        // Update task name
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        await user.clear(taskNameInput);
        await user.type(taskNameInput, 'Updated Task');

        // Submit form
        const submitButton = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    taskName: 'Updated Task',
                })
            );
        });
    });

    test('should validate required task name field', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        // Clear task name
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        await user.clear(taskNameInput);

        // Try to submit
        const submitButton = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/task name is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should update status selection', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        await user.selectOptions(statusSelect, 'DONE');

        expect((statusSelect as HTMLSelectElement).value).toBe('DONE');
    });

    test('should update priority selection', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const lowPriorityButton = screen.getByRole('button', { name: /low/i }) as HTMLButtonElement;
        await user.click(lowPriorityButton);

        expect(lowPriorityButton).toHaveClass('bg-green-500/20 text-green-400');
    });

    test('should update due date', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;
        await user.clear(dueDateInput);
        await user.type(dueDateInput, '2027-01-15');

        expect((dueDateInput as HTMLInputElement).value).toBe('2027-01-15');
    });

    test('should update list selection', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const listSelect = container.querySelector('select[name="listId"]') as HTMLSelectElement;
        await user.selectOptions(listSelect, '2');

        expect((listSelect as HTMLSelectElement).value).toBe('2');
    });

    test('should show loading state when isLoading is true', () => {
        render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
                isLoading={true}
            />
        );

        const submitButton = screen.getByRole('button', { name: /saving/i });
        expect(submitButton).toBeDisabled();
    });

    test('should reset form when task prop changes', () => {
        const { rerender, container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const newTask = createMockTask({
            id: 2,
            taskName: 'Different Task',
            description: 'Different description',
            status: 'TODO',
            priority: 'LOW',
        });

        // Update with new task
        rerender(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={newTask}
            />
        );

        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        expect(taskNameInput.value).toBe('Different Task');
    });

    test('should handle task without description', () => {
        const taskWithoutDescription = createMockTask({
            id: 1,
            taskName: 'Task',
            description: '',
            status: 'TODO',
            priority: 'MEDIUM',
        });

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={taskWithoutDescription}
            />
        );

        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        expect(descriptionInput.value).toBe('');
    });

    test('should handle task without due date', () => {
        const taskWithoutDueDate = createMockTask({
            id: 1,
            taskName: 'Task',
            dueDate: null,
        });

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={taskWithoutDueDate as any}
            />
        );

        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;
        expect(dueDateInput.value).toBe('');
    });

    test('should handle task without list', () => {
        const taskWithoutList = createMockTask({
            id: 1,
            taskName: 'Task',
            listId: null,
        });

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={taskWithoutList}
            />
        );

        const listSelect = container.querySelector('select[name="listId"]') as HTMLSelectElement;
        expect(listSelect.value).toBe('');
    });

    test('should submit with all updated fields', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        // Update all fields
        const taskNameInput = container.querySelector('input[name="taskName"]') as HTMLInputElement;
        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
        const statusSelect = container.querySelector('select[name="status"]') as HTMLSelectElement;
        const lowPriorityButton = screen.getByRole('button', { name: /low/i }) as HTMLButtonElement;
        const dueDateInput = container.querySelector('input[name="dueDate"]') as HTMLInputElement;
        const listSelect = container.querySelector('select[name="listId"]') as HTMLSelectElement;

        await user.clear(taskNameInput);
        await user.type(taskNameInput, 'Fully Updated Task');

        await user.clear(descriptionInput);
        await user.type(descriptionInput, 'New description');

        await user.selectOptions(statusSelect, 'DONE');
        await user.click(lowPriorityButton);

        await user.clear(dueDateInput);
        await user.type(dueDateInput, '2027-06-15');

        await user.selectOptions(listSelect, '2');

        // Submit
        const submitButton = screen.getByRole('button', { name: /save changes/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith({
                taskName: 'Fully Updated Task',
                description: 'New description',
                status: 'DONE',
                priority: 'LOW',
                dueDate: '2027-06-15',
                listId: 2,
            });
        });
    });

    test('should display cancel button', () => {
        render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();
    });

    test('should close modal when cancel button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <EditTaskModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                task={mockTask}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
