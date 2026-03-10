import { test, expect } from '@playwright/test';
import listsReducer, {
  setLists,
  setCurrentList,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} from '../../src/features/lists/listsSlice';
import type { List } from '../../src/types';

// Mock lists data
const mockLists: List[] = [
  {
    id: 1,
    title: 'Work',
    description: 'Work tasks',
    color: '#3B82F6',
    isFavorite: false,
    authorId: 1,
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    title: 'Personal',
    description: 'Personal tasks',
    color: '#10B981',
    isFavorite: true,
    authorId: 1,
    createdAt: '2026-01-02',
  },
];

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('listsSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = listsReducer(undefined, { type: 'unknown' });

    expect(state.lists).toEqual([]);
    expect(state.currentList).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// setLists Action Tests
// ============================================================================
test.describe('listsSlice - setLists', () => {
  test('should set lists and clear error', () => {
    const state = listsReducer(undefined, setLists(mockLists));

    expect(state.lists).toEqual(mockLists);
    expect(state.error).toBeNull();
  });

  test('should replace existing lists', () => {
    const initialState = {
      lists: [mockLists[0]],
      currentList: null,
      isLoading: false,
      error: 'Previous error',
    };

    const state = listsReducer(initialState, setLists(mockLists));

    expect(state.lists).toEqual(mockLists);
    expect(state.error).toBeNull();
  });

  test('should handle empty lists array', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, setLists([]));

    expect(state.lists).toEqual([]);
  });
});

// ============================================================================
// setCurrentList Action Tests
// ============================================================================
test.describe('listsSlice - setCurrentList', () => {
  test('should set current list', () => {
    const state = listsReducer(undefined, setCurrentList(mockLists[0]));

    expect(state.currentList).toEqual(mockLists[0]);
  });

  test('should clear current list when null', () => {
    const initialState = {
      lists: mockLists,
      currentList: mockLists[0],
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, setCurrentList(null));

    expect(state.currentList).toBeNull();
  });
});

// ============================================================================
// addList Action Tests
// ============================================================================
test.describe('listsSlice - addList', () => {
  test('should add new list to empty array', () => {
    const newList: List = {
      id: 3,
      title: 'Shopping',
      description: 'Shopping list',
      color: '#F59E0B',
      isFavorite: false,
      createdAt: '2026-01-03',
      authorId: 1,
    };

    const state = listsReducer(undefined, addList(newList));

    expect(state.lists).toHaveLength(1);
    expect(state.lists[0]).toEqual(newList);
  });

  test('should add new list to existing lists', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const newList: List = {
      id: 3,
      title: 'Shopping',
      description: 'Shopping list',
      color: '#F59E0B',
      isFavorite: false,
      authorId: 1,
      createdAt: '2026-01-03',
    };

    const state = listsReducer(initialState, addList(newList));

    expect(state.lists).toHaveLength(3);
    expect(state.lists[2]).toEqual(newList);
  });
});

// ============================================================================
// updateList Action Tests
// ============================================================================
test.describe('listsSlice - updateList', () => {
  test('should update existing list in array', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const updatedList: List = {
      ...mockLists[0],
      title: 'Work Updated',
      isFavorite: true,
    };

    const state = listsReducer(initialState, updateList(updatedList));

    expect(state.lists[0].title).toBe('Work Updated');
    expect(state.lists[0].isFavorite).toBe(true);
  });

  test('should update currentList if it matches the updated list', () => {
    const initialState = {
      lists: mockLists,
      currentList: mockLists[0],
      isLoading: false,
      error: null,
    };

    const updatedList: List = {
      ...mockLists[0],
      title: 'Work Updated',
    };

    const state = listsReducer(initialState, updateList(updatedList));

    expect(state.currentList?.title).toBe('Work Updated');
  });

  test('should not update currentList if id does not match', () => {
    const initialState = {
      lists: mockLists,
      currentList: mockLists[0],
      isLoading: false,
      error: null,
    };

    const updatedList: List = {
      ...mockLists[1],
      title: 'Personal Updated',
    };

    const state = listsReducer(initialState, updateList(updatedList));

    expect(state.currentList).toEqual(mockLists[0]);
  });

  test('should not modify state if list id not found', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const nonExistentList: List = {
      id: 999,
      title: 'Non-existent',
      description: 'Does not exist',
      color: '#000000',
      isFavorite: false,
      authorId: 1,
      createdAt: '2026-01-01',
    };

    const state = listsReducer(initialState, updateList(nonExistentList));

    expect(state.lists).toEqual(mockLists);
  });
});

// ============================================================================
// deleteList Action Tests
// ============================================================================
test.describe('listsSlice - deleteList', () => {
  test('should delete list by id', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, deleteList(1));

    expect(state.lists).toHaveLength(1);
    expect(state.lists[0].id).toBe(2);
  });

  test('should clear currentList if deleted list is current', () => {
    const initialState = {
      lists: mockLists,
      currentList: mockLists[0],
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, deleteList(1));

    expect(state.currentList).toBeNull();
  });

  test('should not clear currentList if deleted list is not current', () => {
    const initialState = {
      lists: mockLists,
      currentList: mockLists[0],
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, deleteList(2));

    expect(state.currentList).toEqual(mockLists[0]);
  });

  test('should handle deleting non-existent list id', () => {
    const initialState = {
      lists: mockLists,
      currentList: null,
      isLoading: false,
      error: null,
    };

    const state = listsReducer(initialState, deleteList(999));

    expect(state.lists).toEqual(mockLists);
  });
});

// ============================================================================
// setLoading Action Tests
// ============================================================================
test.describe('listsSlice - setLoading', () => {
  test('should set loading to true', () => {
    const state = listsReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  test('should set loading to false', () => {
    const initialState = {
      lists: [],
      currentList: null,
      isLoading: true,
      error: null,
    };

    const state = listsReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// setError Action Tests
// ============================================================================
test.describe('listsSlice - setError', () => {
  test('should set error and stop loading', () => {
    const initialState = {
      lists: [],
      currentList: null,
      isLoading: true,
      error: null,
    };

    const state = listsReducer(initialState, setError('Failed to load lists'));

    expect(state.error).toBe('Failed to load lists');
    expect(state.isLoading).toBe(false);
  });

  test('should clear error when null', () => {
    const initialState = {
      lists: [],
      currentList: null,
      isLoading: false,
      error: 'Previous error',
    };

    const state = listsReducer(initialState, setError(null));
    expect(state.error).toBeNull();
  });
});
