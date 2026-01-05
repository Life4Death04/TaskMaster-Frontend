import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { List } from '@/types';

interface ListsState {
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ListsState = {
  lists: [],
  currentList: null,
  isLoading: false,
  error: null,
};

const listsSlice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
      state.error = null;
    },
    setCurrentList: (state, action: PayloadAction<List | null>) => {
      state.currentList = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateList: (state, action: PayloadAction<List>) => {
      const index = state.lists.findIndex(
        (list) => list.id === action.payload.id
      );
      if (index !== -1) {
        state.lists[index] = action.payload;
      }
      if (state.currentList?.id === action.payload.id) {
        state.currentList = action.payload;
      }
    },
    deleteList: (state, action: PayloadAction<number>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
      if (state.currentList?.id === action.payload) {
        state.currentList = null;
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
  setLists,
  setCurrentList,
  addList,
  updateList,
  deleteList,
  setLoading,
  setError,
} = listsSlice.actions;
export default listsSlice.reducer;
