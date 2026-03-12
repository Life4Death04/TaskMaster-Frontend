import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteConfirmationModal } from '../../../src/components/Modals/DeleteConfirmationModal';
import { render } from '../test-utils';
import '../setup';

/**
 * DeleteConfirmationModal Integration Tests
 * Tests the integration between DeleteConfirmationModal and user interactions
 */

// ============================================================================
// Integration Tests
// ============================================================================

describe('DeleteConfirmationModal - Integration Tests', () => {
    const mockOnClose = vi.fn();
    const mockOnConfirm = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should render modal when open', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        expect(screen.getByRole('heading', { name: /delete/i })).toBeInTheDocument();
    });

    test('should not render modal when closed', () => {
        render(
            <DeleteConfirmationModal
                isOpen={false}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        expect(screen.queryByRole('heading', { name: /delete/i })).not.toBeInTheDocument();
    });

    test('should display item name in confirmation message', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="My Important Task"
                itemType="task"
            />
        );

        expect(screen.getByText(/My Important Task/i)).toBeInTheDocument();
    });

    test('should display item type in title', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test List"
                itemType="list"
            />
        );

        // Should show "Delete list" or similar
        const heading = screen.getByRole('heading', { name: /delete/i });
        expect(heading.textContent).toMatch(/list/i);
    });

    test('should close modal when close button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should close modal when cancel button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await user.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should call onConfirm when delete button is clicked', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);

        await waitFor(() => {
            expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        });
    });

    test('should close modal after confirmation', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        await user.click(deleteButton);

        await waitFor(() => {
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    test('should disable buttons when loading', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
                isLoading={true}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        const deleteButton = screen.getByRole('button', { name: /deleting.../i });

        expect(deleteButton).toBeDisabled();
        expect(cancelButton).toBeDisabled();
    });

    test('should not call handlers when buttons are disabled', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
                isLoading={true}
            />
        );

        const deleteButton = screen.getByRole('button', { name: /deleting.../i });
        const cancelButton = screen.getByRole('button', { name: /cancel/i });

        await user.click(deleteButton);
        await user.click(cancelButton);

        expect(mockOnConfirm).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('should display warning message', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        // Should contain warning about irreversibility
        expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument();
    });

    test('should handle different item types - task', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="My Task"
                itemType="task"
            />
        );

        const heading = screen.getByRole('heading', { name: /delete/i });
        expect(heading.textContent).toMatch(/task/i);
    });

    test('should handle different item types - list', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="My List"
                itemType="list"
            />
        );

        const heading = screen.getByRole('heading', { name: /delete/i });
        expect(heading.textContent).toMatch(/list/i);
    });

    test('should handle different item types - account', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="My Account"
                itemType="account"
            />
        );

        const heading = screen.getByRole('heading', { name: /delete/i });
        expect(heading.textContent).toMatch(/account/i);
    });

    test('should use default item type when not specified', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Something"
            />
        );

        // Should default to 'item'
        const heading = screen.getByRole('heading', { name: /delete/i });
        expect(heading.textContent).toMatch(/item/i);
    });

    test('should style delete button as dangerous action', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });

        // Delete button should have red/danger styling
        expect(deleteButton).toHaveClass(/bg-red-600/i);
    });

    test('should have accessible close button', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const closeButton = screen.getByLabelText(/close modal/i);
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveAttribute('aria-label');
    });

    test('should handle multiple confirmations', async () => {
        const user = userEvent.setup();

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });

        // Click multiple times (though normally modal would close after first)
        await user.click(deleteButton);
        await user.click(deleteButton);

        // Should be called at least once
        expect(mockOnConfirm).toHaveBeenCalled();
    });

    test('should display both action buttons', () => {
        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName="Test Task"
                itemType="task"
            />
        );

        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    test('should handle long item names', () => {
        const longName = 'This is a very long task name that should be displayed properly in the confirmation modal';

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName={longName}
                itemType="task"
            />
        );

        expect(screen.getByText(new RegExp(longName, 'i'))).toBeInTheDocument();
    });

    test('should handle special characters in item name', () => {
        const specialName = "Task with 'quotes' & special <characters>";

        render(
            <DeleteConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemName={specialName}
                itemType="task"
            />
        );

        // Should safely render special characters
        expect(screen.getByText(new RegExp("Task with 'quotes'", 'i'))).toBeInTheDocument();
    });
});
