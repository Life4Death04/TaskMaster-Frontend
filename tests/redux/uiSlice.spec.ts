import { test, expect } from '@playwright/test';
import uiReducer, {
  setLoading,
  openModal,
  closeModal,
  addToast,
  removeToast,
  toggleSidebar,
  setSidebarOpen,
} from '../../src/features/ui/uiSlice';
import type { ToastNotification, ModalPayload } from '../../src/types';

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('uiSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = uiReducer(undefined, { type: 'unknown' });

    expect(state.isLoading).toBe(false);
    expect(state.modal.isOpen).toBe(false);
    expect(state.modal.type).toBeNull();
    expect(state.toasts).toEqual([]);
    expect(state.sidebarOpen).toBe(true);
  });
});

// ============================================================================
// setLoading Action Tests
// ============================================================================
test.describe('uiSlice - setLoading', () => {
  test('should set loading to true', () => {
    const state = uiReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  test('should set loading to false', () => {
    const initialState = {
      isLoading: true,
      modal: { isOpen: false, type: null },
      toasts: [],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// Modal Actions Tests
// ============================================================================
test.describe('uiSlice - Modal Actions', () => {
  test('should open modal with type only', () => {
    const modalPayload: ModalPayload = {
      type: 'CREATE_TASK',
    };

    const state = uiReducer(undefined, openModal(modalPayload));

    expect(state.modal.isOpen).toBe(true);
    expect(state.modal.type).toBe('CREATE_TASK');
  });

  test('should open modal with type and data', () => {
    const modalPayload: ModalPayload = {
      type: 'EDIT_TASK',
      data: {
        id: 123,
        taskName: 'Test task',
        description: 'Test',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        listId: 1,
      },
    };

    const state = uiReducer(undefined, openModal(modalPayload));

    expect(state.modal.isOpen).toBe(true);
    expect(state.modal.type).toBe('EDIT_TASK');
    expect(state.modal.data).toEqual(modalPayload.data);
  });

  test('should close modal and clear data', () => {
    const initialState = {
      isLoading: false,
      modal: {
        isOpen: true,
        type: 'CREATE_TASK' as const,
        data: { defaultListId: 1 },
      },
      toasts: [],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, closeModal());

    expect(state.modal.isOpen).toBe(false);
    expect(state.modal.type).toBeNull();
    expect(state.modal.data).toBeUndefined();
  });

  test('should replace existing modal when opening new one', () => {
    const initialState = {
      isLoading: false,
      modal: {
        isOpen: true,
        type: 'CREATE_TASK' as const,
      },
      toasts: [],
      sidebarOpen: true,
    };

    const newModalPayload: ModalPayload = {
      type: 'EDIT_LIST',
      data: {
        id: 456,
        title: 'Test List',
        description: 'Test',
        color: '#FF0000',
      },
    };

    const state = uiReducer(initialState, openModal(newModalPayload));

    expect(state.modal.isOpen).toBe(true);
    expect(state.modal.type).toBe('EDIT_LIST');
    expect(state.modal.data).toEqual(newModalPayload.data);
  });
});

// ============================================================================
// Toast Actions Tests
// ============================================================================
test.describe('uiSlice - Toast Actions', () => {
  test('should add toast with auto-generated id', () => {
    const toastPayload = {
      type: 'success' as const,
      message: 'Task created successfully',
    };

    const state = uiReducer(undefined, addToast(toastPayload));

    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].type).toBe('success');
    expect(state.toasts[0].message).toBe('Task created successfully');
    expect(state.toasts[0].id).toBeDefined();
    expect(typeof state.toasts[0].id).toBe('string');
  });

  test('should add multiple toasts', () => {
    let state = uiReducer(undefined, { type: 'unknown' });

    state = uiReducer(
      state,
      addToast({ type: 'success', message: 'First toast' })
    );
    state = uiReducer(
      state,
      addToast({ type: 'error', message: 'Second toast' })
    );
    state = uiReducer(
      state,
      addToast({ type: 'info', message: 'Third toast' })
    );

    expect(state.toasts).toHaveLength(3);
    expect(state.toasts[0].message).toBe('First toast');
    expect(state.toasts[1].message).toBe('Second toast');
    expect(state.toasts[2].message).toBe('Third toast');
  });

  test('should generate unique ids for each toast', () => {
    let state = uiReducer(undefined, { type: 'unknown' });

    state = uiReducer(state, addToast({ type: 'success', message: 'Toast 1' }));
    state = uiReducer(state, addToast({ type: 'success', message: 'Toast 2' }));

    expect(state.toasts[0].id).not.toBe(state.toasts[1].id);
  });

  test('should remove toast by id', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [
        { id: 'toast-1', type: 'success' as const, message: 'First' },
        { id: 'toast-2', type: 'error' as const, message: 'Second' },
        { id: 'toast-3', type: 'info' as const, message: 'Third' },
      ],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, removeToast('toast-2'));

    expect(state.toasts).toHaveLength(2);
    expect(state.toasts[0].id).toBe('toast-1');
    expect(state.toasts[1].id).toBe('toast-3');
  });

  test('should handle removing non-existent toast id', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [{ id: 'toast-1', type: 'success' as const, message: 'First' }],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, removeToast('non-existent'));

    expect(state.toasts).toEqual(initialState.toasts);
  });

  test('should add toast with all toast types', () => {
    const toastTypes = ['success', 'error', 'warning', 'info'] as const;

    toastTypes.forEach((type) => {
      const state = uiReducer(
        undefined,
        addToast({ type, message: `${type} message` })
      );

      expect(state.toasts[0].type).toBe(type);
      expect(state.toasts[0].message).toBe(`${type} message`);
    });
  });
});

// ============================================================================
// Sidebar Actions Tests
// ============================================================================
test.describe('uiSlice - Sidebar Actions', () => {
  test('should toggle sidebar from open to closed', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarOpen).toBe(false);
  });

  test('should toggle sidebar from closed to open', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [],
      sidebarOpen: false,
    };

    const state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarOpen).toBe(true);
  });

  test('should set sidebar to open', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [],
      sidebarOpen: false,
    };

    const state = uiReducer(initialState, setSidebarOpen(true));
    expect(state.sidebarOpen).toBe(true);
  });

  test('should set sidebar to closed', () => {
    const initialState = {
      isLoading: false,
      modal: { isOpen: false, type: null },
      toasts: [],
      sidebarOpen: true,
    };

    const state = uiReducer(initialState, setSidebarOpen(false));
    expect(state.sidebarOpen).toBe(false);
  });
});

// ============================================================================
// Complex Scenario Tests
// ============================================================================
test.describe('uiSlice - Complex Scenarios', () => {
  test('should handle multiple UI actions together', () => {
    let state = uiReducer(undefined, { type: 'unknown' });

    // Start loading
    state = uiReducer(state, setLoading(true));

    // Open modal
    state = uiReducer(state, openModal({ type: 'CREATE_TASK' }));

    // Add toast
    state = uiReducer(
      state,
      addToast({ type: 'success', message: 'Task created' })
    );

    // Close sidebar
    state = uiReducer(state, setSidebarOpen(false));

    expect(state.isLoading).toBe(true);
    expect(state.modal.isOpen).toBe(true);
    expect(state.toasts).toHaveLength(1);
    expect(state.sidebarOpen).toBe(false);
  });

  test('should handle toast queue management', () => {
    let state = uiReducer(undefined, { type: 'unknown' });

    // Add 3 toasts
    state = uiReducer(state, addToast({ type: 'success', message: 'First' }));
    const firstToastId = state.toasts[0].id;

    state = uiReducer(state, addToast({ type: 'error', message: 'Second' }));
    const secondToastId = state.toasts[1].id;

    state = uiReducer(state, addToast({ type: 'info', message: 'Third' }));

    expect(state.toasts).toHaveLength(3);

    // Remove first toast
    state = uiReducer(state, removeToast(firstToastId));
    expect(state.toasts).toHaveLength(2);

    // Remove second toast
    state = uiReducer(state, removeToast(secondToastId));
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Third');
  });

  test('should handle modal state transitions', () => {
    let state = uiReducer(undefined, { type: 'unknown' });

    // Open create modal
    state = uiReducer(state, openModal({ type: 'CREATE_TASK' }));
    expect(state.modal.isOpen).toBe(true);
    expect(state.modal.type).toBe('CREATE_TASK');

    // Close modal
    state = uiReducer(state, closeModal());
    expect(state.modal.isOpen).toBe(false);
    expect(state.modal.type).toBeNull();

    // Open edit modal with data
    state = uiReducer(
      state,
      openModal({
        type: 'EDIT_TASK',
        data: {
          id: 123,
          taskName: 'Test',
          description: 'Test',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: null,
          listId: 1,
        },
      })
    );
    expect(state.modal.isOpen).toBe(true);
    expect(state.modal.type).toBe('EDIT_TASK');
    expect(state.modal.data?.id).toBe(123);

    // Close modal
    state = uiReducer(state, closeModal());
    expect(state.modal.isOpen).toBe(false);
    expect(state.modal.data).toBeUndefined();
  });
});
