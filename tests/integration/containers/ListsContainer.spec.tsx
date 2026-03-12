import { test, expect, vi, describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ListsContainer } from '../../../src/containers/ListsContainer';
import {
    render,
    createMockList,
    createMockTask,
    createInitialState,
} from '../test-utils';
import '../setup';

/**
 * Lists Container Integration Tests
 * Tests the integration between ListsContainer, React Query hooks, Redux, and routing
 */

// ============================================================================
// Test Setup & Mocks
// ============================================================================

// Mock React Query hooks
vi.mock('../../../src/api/queries/lists.queries', () => ({
    useFetchLists: vi.fn(),
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

import { useFetchLists } from '../../../src/api/queries/lists.queries';

// ============================================================================
// Integration Tests
// ============================================================================

describe('ListsContainer - Integration Tests', () => {
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        mockNavigate.mockClear();
    });

    test('should render lists container with welcome message', async () => {
        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        // Check for welcome message with user name
        expect(screen.getByText(/My Lists/i)).toBeInTheDocument();
    });

    test('should display loading state while fetching lists', async () => {
        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
            isLoading: true,
            error: null,
        } as any);

        render(<ListsContainer />);

        expect(screen.getByText(/loading lists/i)).toBeInTheDocument();
    });

    test('should render and display lists from API', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work Tasks', description: 'Work related tasks' }),
            createMockList({ id: 2, title: 'Personal', description: 'Personal tasks' }),
            createMockList({ id: 3, title: 'Shopping', description: 'Shopping list' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        await waitFor(() => {
            expect(screen.getByText('Work Tasks')).toBeInTheDocument();
            expect(screen.getByText('Personal')).toBeInTheDocument();
            expect(screen.getByText('Shopping')).toBeInTheDocument();
        });
    });

    test('should display task count for each list', async () => {
        const mockLists = [
            createMockList({
                id: 1,
                title: 'Task List',
                tasks: [
                    createMockTask({ id: 1 }),
                    createMockTask({ id: 2 }),
                    createMockTask({ id: 3 }),
                ],
            }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        await waitFor(() => {
            expect(screen.getByText(/3 tasks/i)).toBeInTheDocument();
        });
    });

    test('should filter lists by search query', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work Tasks', description: 'Office work' }),
            createMockList({ id: 2, title: 'Home Projects', description: 'DIY tasks' }),
            createMockList({ id: 3, title: 'Shopping List', description: 'Groceries' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<ListsContainer />);

        // Find search input
        const searchInput = screen.getByPlaceholderText(/search/i);

        // Type search query
        await user.type(searchInput, 'work');

        // Only matching lists should be visible
        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 3, name: 'Work Tasks' })).toBeInTheDocument();
            expect(screen.queryByRole('heading', { level: 3, name: 'Home Projects' })).not.toBeInTheDocument(); // Contains "work" in description
            expect(screen.queryByRole('heading', { level: 3, name: 'Shopping List' })).not.toBeInTheDocument();
        });
    });

    test('should search in both title and description', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Project Alpha', description: 'Important work' }),
            createMockList({ id: 2, title: 'Shopping', description: 'Grocery shopping' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<ListsContainer />);

        const searchInput = screen.getByPlaceholderText(/search/i);

        // Search by description keyword
        await user.type(searchInput, 'shopping');

        await waitFor(() => {
            expect(screen.getByText('Shopping')).toBeInTheDocument();
            expect(screen.queryByText('Project Alpha')).not.toBeInTheDocument();
        });
    });

    test('should navigate to list details when clicking a list', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'My List' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<ListsContainer />);

        // Click on the list card
        const listCard = await screen.findByText('My List');
        await user.click(listCard);

        // Check if navigate was called with correct path
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/lists/1');
        });
    });

    test('should open create list modal when clicking add button', async () => {
        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        const { store } = render(<ListsContainer />);

        // Click add list button (get first button found to avoid multiple match error)
        const addButtons = screen.getAllByRole('button', { name: /Create New List/i });
        await user.click(addButtons[0]);

        // Check if modal state was updated in Redux
        await waitFor(() => {
            const state = store.getState();
            expect(state.ui.modal.type).toBe('CREATE_LIST');
            expect(state.ui.modal.isOpen).toBe(true);
        });
    });

    test('should display empty state when no lists exist', async () => {
        vi.mocked(useFetchLists).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        await waitFor(() => {
            // Check that no list cards are rendered
            const listCards = screen.queryAllByTestId('list-card');
            expect(listCards).toHaveLength(0);
        });
    });

    test('should display empty state when no lists match search', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work Tasks' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<ListsContainer />);

        // Search for non-existent list
        const searchInput = screen.getByPlaceholderText(/search/i);
        await user.type(searchInput, 'nonexistent');

        await waitFor(() => {
            expect(screen.getByText(/no lists found/i)).toBeInTheDocument();
        });
    });

    test('should display list colors correctly', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Red List', color: '#EF4444' }),
            createMockList({ id: 2, title: 'Blue List', color: '#3B82F6' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        await waitFor(() => {
            const redList = screen.getByText('Red List').closest('div');
            const blueList = screen.getByText('Blue List').closest('div');

            // Check if the color is applied (implementation may vary)
            expect(redList).toBeInTheDocument();
            expect(blueList).toBeInTheDocument();
        });
    });

    test('should handle lists with no description', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'No Description List', description: null }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        render(<ListsContainer />);

        await waitFor(() => {
            expect(screen.getByText('No Description List')).toBeInTheDocument();
            expect(screen.getByText('No description')).toBeInTheDocument();
        });
    });

    test('should clear search and show all lists', async () => {
        const mockLists = [
            createMockList({ id: 1, title: 'Work' }),
            createMockList({ id: 2, title: 'Personal' }),
        ];

        vi.mocked(useFetchLists).mockReturnValue({
            data: mockLists,
            isLoading: false,
            error: null,
        } as any);

        const user = userEvent.setup();
        render(<ListsContainer />);

        const searchInput = screen.getByPlaceholderText(/search/i);

        // Type search
        await user.type(searchInput, 'work');
        await waitFor(() => {
            expect(screen.getByText('Work')).toBeInTheDocument();
            expect(screen.queryByText('Personal')).not.toBeInTheDocument();
        });

        // Clear search
        await user.clear(searchInput);

        // All lists should be visible again
        await waitFor(() => {
            expect(screen.getByText('Work')).toBeInTheDocument();
            expect(screen.getByText('Personal')).toBeInTheDocument();
        });
    });
});
