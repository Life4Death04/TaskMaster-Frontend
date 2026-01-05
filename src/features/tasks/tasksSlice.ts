import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '@/types';

interface TasksState {
  tasks: Task[];
  archivedTasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  archivedTasks: [],
  isLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload.filter((task) => !task.archived);
      state.archivedTasks = action.payload.filter((task) => task.archived);
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      if (action.payload.archived) {
        state.archivedTasks.push(action.payload);
      } else {
        state.tasks.push(action.payload);
      }
    },
    updateTask: (state, action: PayloadAction<Task>) => {
      const taskList = action.payload.archived
        ? state.archivedTasks
        : state.tasks;
      const index = taskList.findIndex((task) => task.id === action.payload.id);
      if (index !== -1) {
        taskList[index] = action.payload;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.archivedTasks = state.archivedTasks.filter(
        (task) => task.id !== action.payload
      );
    },
    toggleArchiveTask: (state, action: PayloadAction<number>) => {
      const taskIndex = state.tasks.findIndex(
        (task) => task.id === action.payload
      );
      if (taskIndex !== -1) {
        const task = state.tasks[taskIndex];
        state.tasks.splice(taskIndex, 1);
        state.archivedTasks.push({ ...task, archived: true });
      } else {
        const archivedIndex = state.archivedTasks.findIndex(
          (task) => task.id === action.payload
        );
        if (archivedIndex !== -1) {
          const task = state.archivedTasks[archivedIndex];
          state.archivedTasks.splice(archivedIndex, 1);
          state.tasks.push({ ...task, archived: false });
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleArchiveTask,
  setLoading,
  setError,
} = tasksSlice.actions;
export default tasksSlice.reducer;
