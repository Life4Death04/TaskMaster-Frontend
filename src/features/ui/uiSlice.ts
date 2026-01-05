import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ToastNotification, ModalState } from '@/types';

interface UIState {
  isLoading: boolean;
  modal: ModalState;
  toasts: ToastNotification[];
  sidebarOpen: boolean;
}

const initialState: UIState = {
  isLoading: false,
  modal: {
    isOpen: false,
    type: null,
    data: undefined,
  },
  toasts: [],
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    openModal: (
      state,
      action: PayloadAction<{ type: string; data?: any /*!!! ANY*/ }>
    ) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: undefined,
      };
    },
    addToast: (state, action: PayloadAction<Omit<ToastNotification, 'id'>>) => {
      state.toasts.push({
        ...action.payload,
        id: Date.now().toString() + Math.random(),
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setLoading,
  openModal,
  closeModal,
  addToast,
  removeToast,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
