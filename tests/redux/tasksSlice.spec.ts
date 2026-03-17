import { test, expect } from '@playwright/test';
import tasksReducer, {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleArchiveTask,
  setLoading,
  setError,
} from '../../src/features/tasks/tasksSlice';
import type { Task } from '../../src/types';

// Mock tasks data (with archived property for slice testing)
const mockTasks: Array<Task & { archived?: boolean }> = [
  {
    id: 1,
    taskName: 'Complete project',
    description: 'Finish the TaskMaster project',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-03-15',
    authorId: 1,
    listId: 1,
    archived: false,
  },
  {
    id: 2,
    taskName: 'Write tests',
    description: 'Write unit tests for Redux slices',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    dueDate: '2026-03-10',
    authorId: 1,
    listId: 1,
    archived: false,
  },
  {
    id: 3,
    taskName: 'Old task',
    description: 'Archived task',
    status: 'DONE',
    priority: 'LOW',
    dueDate: null,
    authorId: 1,
    listId: 1,
    archived: true,
  },
];

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('tasksSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = tasksReducer(undefined, { type: 'unknown' });

    expect(state.tasks).toEqual([]);
    expect(state.archivedTasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// setTasks Action Tests
// ============================================================================
test.describe('tasksSlice - setTasks', () => {
  test('should separate tasks and archived tasks', () => {
    const state = tasksReducer(undefined, setTasks(mockTasks));

    expect(state.tasks).toHaveLength(2);
    expect(state.archivedTasks).toHaveLength(1);
    expect(state.error).toBeNull();
  });

  test('should only set active tasks when no archived tasks', () => {
    const activeTasks = mockTasks.filter((task) => !task.archived);
    const state = tasksReducer(undefined, setTasks(activeTasks));

    expect(state.tasks).toHaveLength(2);
    expect(state.archivedTasks).toHaveLength(0);
  });

  test('should handle empty tasks array', () => {
    const state = tasksReducer(undefined, setTasks([]));

    expect(state.tasks).toEqual([]);
    expect(state.archivedTasks).toEqual([]);
  });

  test('should replace existing tasks', () => {
    const initialState = {
      tasks: [mockTasks[0]],
      archivedTasks: [],
      isLoading: false,
      error: 'Previous error',
    };

    const state = tasksReducer(initialState, setTasks(mockTasks));

    expect(state.tasks).toHaveLength(2);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// addTask Action Tests
// ============================================================================
test.describe('tasksSlice - addTask', () => {
  test('should add active task to tasks array', () => {
    const newTask: Task & { archived?: boolean } = {
      id: 4,
      taskName: 'New task',
      description: 'A new task',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
      authorId: 1,
      listId: 1,
      archived: false,
    };

    const state = tasksReducer(undefined, addTask(newTask));

    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(newTask);
  });

  test('should add archived task to archivedTasks array', () => {
    const archivedTask: Task & { archived?: boolean } = {
      id: 4,
      taskName: 'Archived task',
      description: 'An archived task',
      status: 'DONE',
      priority: 'LOW',
      dueDate: null,
      authorId: 1,
      listId: 1,
      archived: true,
    };

    const state = tasksReducer(undefined, addTask(archivedTask));

    expect(state.archivedTasks).toHaveLength(1);
    expect(state.archivedTasks[0]).toEqual(archivedTask);
  });
});

// ============================================================================
// updateTask Action Tests
// ============================================================================
test.describe('tasksSlice - updateTask', () => {
  test('should update active task in tasks array', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const updatedTask: Task = {
      ...mockTasks[0],
      taskName: 'Updated task name',
      status: 'DONE',
    };

    const state = tasksReducer(initialState, updateTask(updatedTask));

    expect(state.tasks[0].taskName).toBe('Updated task name');
    expect(state.tasks[0].status).toBe('DONE');
  });

  test('should update archived task in archivedTasks array', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const updatedTask: Task = {
      ...mockTasks[2],
      taskName: 'Updated archived task',
    };

    const state = tasksReducer(initialState, updateTask(updatedTask));

    expect(state.archivedTasks[0].taskName).toBe('Updated archived task');
  });

  test('should not modify state if task id not found', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const nonExistentTask: Task = {
      id: 999,
      taskName: 'Non-existent',
      description: '',
      status: 'TODO',
      priority: 'LOW',
      dueDate: null,
      authorId: 1,
      listId: 1,
    };

    const state = tasksReducer(initialState, updateTask(nonExistentTask));

    expect(state.tasks).toEqual(initialState.tasks);
  });
});

// ============================================================================
// deleteTask Action Tests
// ============================================================================
test.describe('tasksSlice - deleteTask', () => {
  test('should delete active task from tasks array', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, deleteTask(1));

    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].id).toBe(2);
  });

  test('should delete archived task from archivedTasks array', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, deleteTask(3));

    expect(state.archivedTasks).toHaveLength(0);
  });

  test('should handle deleting non-existent task', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, deleteTask(999));

    expect(state.tasks).toEqual(initialState.tasks);
    expect(state.archivedTasks).toEqual(initialState.archivedTasks);
  });
});

// ============================================================================
// toggleArchiveTask Action Tests
// ============================================================================
test.describe('tasksSlice - toggleArchiveTask', () => {
  test('should archive an active task', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, toggleArchiveTask(1));

    expect(state.tasks).toHaveLength(1);
    expect(state.archivedTasks).toHaveLength(2);
    expect(state.archivedTasks[1].id).toBe(1);
    expect(state.archivedTasks[1].archived).toBe(true);
  });

  test('should unarchive an archived task', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, toggleArchiveTask(3));

    expect(state.archivedTasks).toHaveLength(0);
    expect(state.tasks).toHaveLength(3);
    expect(state.tasks[2].id).toBe(3);
    expect(state.tasks[2].archived).toBe(false);
  });

  test('should handle toggling non-existent task', () => {
    const initialState = {
      tasks: mockTasks.filter((t) => !t.archived),
      archivedTasks: mockTasks.filter((t) => t.archived),
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, toggleArchiveTask(999));

    expect(state.tasks).toEqual(initialState.tasks);
    expect(state.archivedTasks).toEqual(initialState.archivedTasks);
  });
});

// ============================================================================
// setLoading Action Tests
// ============================================================================
test.describe('tasksSlice - setLoading', () => {
  test('should set loading to true', () => {
    const state = tasksReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  test('should set loading to false', () => {
    const initialState = {
      tasks: [],
      archivedTasks: [],
      isLoading: true,
      error: null,
    };

    const state = tasksReducer(initialState, setLoading(false));
    expect(state.isLoading).toBe(false);
  });
});

// ============================================================================
// setError Action Tests
// ============================================================================
test.describe('tasksSlice - setError', () => {
  test('should set error and stop loading', () => {
    const initialState = {
      tasks: [],
      archivedTasks: [],
      isLoading: true,
      error: null,
    };

    const state = tasksReducer(initialState, setError('Failed to load tasks'));

    expect(state.error).toBe('Failed to load tasks');
    expect(state.isLoading).toBe(false);
  });

  test('should clear error when null', () => {
    const initialState = {
      tasks: [],
      archivedTasks: [],
      isLoading: false,
      error: 'Previous error',
    };

    const state = tasksReducer(initialState, setError(null));
    expect(state.error).toBeNull();
  });
});
