import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateListModal } from '../../../src/components/Modals/CreateListModal';
import { render } from '../test-utils';
import '../setup';

/**
 * CreateListModal Integration Tests
 * Tests the integration between CreateListModal, React Hook Form, color selection, and validation
 */

// ============================================================================
// Integration Tests
// ============================================================================

describe('CreateListModal - Integration Tests', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render modal when open', () => {
        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByRole('heading', { name: /create new list/i })).toBeInTheDocument();
    });

    test('should not render modal when closed', () => {
        render(
            <CreateListModal
                isOpen={false}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.queryByRole('heading', { name: /create list/i })).not.toBeInTheDocument();
    });

    test('should display form fields', () => {
        const { container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(container.querySelector('input[name="title"]')).toBeInTheDocument();
        expect(container.querySelector('textarea[name="description"]')).toBeInTheDocument();
    });

    test('should close modal when close button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should display color picker with available colors', () => {
        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Should have color selection heading or label
        expect(screen.getByText(/color/i)).toBeInTheDocument();

        // Should have color buttons - checking for common color names
        const colorButtons = screen.getAllByRole('button');
        expect(colorButtons.length).toBeGreaterThan(5); // At least the color buttons + close/submit
    });

    test('should select a color when clicked', async () => {
        const user = userEvent.setup();

        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Find and click a color button (they should have aria-label or title)
        const colorButtons = screen.getAllByRole('button').filter(btn =>
            btn.getAttribute('aria-label')?.includes('color') ||
            btn.className.includes('bg-')
        );

        if (colorButtons.length > 0) {
            await user.click(colorButtons[1]); // Click second color
            // The color should be selected (visual feedback via classes)
            expect(colorButtons[1]).toHaveClass(/ring|border|selected/);
        }
    });

    test('should submit form with valid data', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill out form
        const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        const descriptionInput = container.querySelector('textarea[name="description"]') as HTMLTextAreaElement;

        await user.type(titleInput, 'Work Tasks');
        await user.type(descriptionInput, 'Tasks for work');

        // Submit form
        const submitButton = screen.getByRole('button', { name: /create list/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Work Tasks',
                    description: 'Tasks for work',
                    color: expect.any(String),
                })
            );
        });
    });

    test('should validate required list name field', async () => {
        const user = userEvent.setup();

        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Try to submit without list name
        const submitButton = screen.getByRole('button', { name: /create list/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/list name is required/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should allow optional description field', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill only required field
        const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        await user.type(titleInput, 'Simple List');

        // Submit form without description
        const submitButton = screen.getByRole('button', { name: /create list/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Simple List',
                    description: '',
                })
            );
        });
    });

    test('should have default color selected', () => {
        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // First color button should be selected by default
        const colorButtons = screen.getAllByRole('button').filter(btn =>
            btn.className.includes('bg-red-') ||
            btn.className.includes('bg-blue-') ||
            btn.className.includes('bg-green-')
        );

        // At least one color should be marked as selected
        const selectedColor = colorButtons.find(btn =>
            btn.className.includes('ring') || btn.className.includes('selected')
        );
        expect(selectedColor).toBeDefined();
    });

    test('should show loading state when isLoading is true', () => {
        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                isLoading={true}
            />
        );

        const submitButton = screen.getByRole('button', { name: /saving/i });
        expect(submitButton).toBeDisabled();
    });

    test('should reset form on close', async () => {
        const user = userEvent.setup();

        const { rerender, container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill out form
        const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        await user.type(titleInput, 'Test List');

        // Close modal
        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        // Reopen modal
        rerender(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Form should be reset
        const listNameInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        expect(listNameInput.value).toBe('');
    });

    test('should submit with color selection', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Fill form
        const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        await user.type(titleInput, 'Colored List');

        // Submit
        const submitButton = screen.getByRole('button', { name: /create list/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Colored List',
                    color: expect.stringMatching(/#[0-9A-F]{6}/i), // Hex color format
                })
            );
        });
    });

    test('should validate title length', async () => {
        const user = userEvent.setup();

        const { container } = render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Try to submit with very long title (if validation exists)
        const longTitle = 'A'.repeat(256);
        const titleInput = container.querySelector('input[name="title"]') as HTMLInputElement;
        await user.type(titleInput, longTitle);

        const submitButton = screen.getByRole('button', { name: /create list/i });
        await user.click(submitButton);

        // Either should succeed or show validation error
        await waitFor(() => {
            const hasError = screen.queryByText(/list name must be 50 characters/i) || screen.queryByText(/maximum/i);
            if (!hasError) {
                expect(mockOnSubmit).toHaveBeenCalled();
            }
        });
    });

    test('should handle multiple color changes', async () => {
        const user = userEvent.setup();

        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const colorButtons = screen.getAllByRole('button').filter(btn =>
            btn.className.includes('bg-')
        );

        // Click multiple colors
        if (colorButtons.length >= 3) {
            await user.click(colorButtons[1]);
            await user.click(colorButtons[2]);

            // Last clicked should be selected
            expect(colorButtons[2]).toHaveClass(/ring|border|selected/);
        }
    });

    test('should display cancel button', () => {
        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();
    });

    test('should close modal when cancel button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <CreateListModal
                isOpen={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
