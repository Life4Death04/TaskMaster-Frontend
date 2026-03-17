import { test, expect } from '@playwright/test';
import tasksReducer, {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} from '../../src/features/tasks/tasksSlice';
import type { Task } from '../../src/types';

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: 1,
    taskName: 'Complete project',
    description: 'Finish the TaskMaster project',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-03-15',
    authorId: 1,
    listId: 1,
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
  },
  {
    id: 3,
    taskName: 'Review code',
    description: 'Code review task',
    status: 'DONE',
    priority: 'LOW',
    dueDate: null,
    authorId: 1,
    listId: 1,
  },
];

// ============================================================================
// Initial State Tests
// ============================================================================
test.describe('tasksSlice - Initial State', () => {
  test('should have correct initial state', () => {
    const state = tasksReducer(undefined, { type: 'unknown' });

    expect(state.tasks).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// setTasks Action Tests
// ============================================================================
test.describe('tasksSlice - setTasks', () => {
  test('should set all tasks', () => {
    const state = tasksReducer(undefined, setTasks(mockTasks));

    expect(state.tasks).toHaveLength(3);
    expect(state.error).toBeNull();
  });

  test('should handle empty tasks array', () => {
    const state = tasksReducer(undefined, setTasks([]));

    expect(state.tasks).toEqual([]);
  });

  test('should replace existing tasks', () => {
    const initialState = {
      tasks: [mockTasks[0]],
      isLoading: false,
      error: 'Previous error',
    };

    const state = tasksReducer(initialState, setTasks(mockTasks));

    expect(state.tasks).toHaveLength(3);
    expect(state.error).toBeNull();
  });
});

// ============================================================================
// addTask Action Tests
// ============================================================================
test.describe('tasksSlice - addTask', () => {
  test('should add task to tasks array', () => {
    const newTask: Task = {
      id: 4,
      taskName: 'New task',
      description: 'A new task',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
      authorId: 1,
      listId: 1,
    };

    const state = tasksReducer(undefined, addTask(newTask));

    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]).toEqual(newTask);
  });
});

// ============================================================================
// updateTask Action Tests
// ============================================================================
test.describe('tasksSlice - updateTask', () => {
  test('should update task in tasks array', () => {
    const initialState = {
      tasks: mockTasks,
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

  test('should not modify state if task id not found', () => {
    const initialState = {
      tasks: mockTasks,
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
  test('should delete task from tasks array', () => {
    const initialState = {
      tasks: mockTasks,
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, deleteTask(1));

    expect(state.tasks).toHaveLength(2);
    expect(state.tasks[0].id).toBe(2);
  });

  test('should handle deleting non-existent task', () => {
    const initialState = {
      tasks: mockTasks,
      isLoading: false,
      error: null,
    };

    const state = tasksReducer(initialState, deleteTask(999));

    expect(state.tasks).toEqual(initialState.tasks);
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
      isLoading: false,
      error: 'Previous error',
    };

    const state = tasksReducer(initialState, setError(null));
    expect(state.error).toBeNull();
  });
});
