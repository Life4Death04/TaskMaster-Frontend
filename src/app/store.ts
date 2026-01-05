import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import tasksReducer from '@/features/tasks/tasksSlice';
import listsReducer from '@/features/lists/listsSlice';
import settingsReducer from '@/features/settings/settingsSlice';
import uiReducer from '@/features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    lists: listsReducer,
    settings: settingsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability checks
        ignoredActions: ['auth/setUser'],
        // Ignore these paths in the state
        ignoredPaths: ['ui.modal.data'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
