// ============================================
// User Types
// ============================================
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
  createdAt?: string;
  emailVerified?: boolean;
}

// ============================================
// Enum Types
// ============================================
export type PriorityTypes = 'LOW' | 'MEDIUM' | 'HIGH';
export type StatusTypes = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type ThemeTypes = 'LIGHT' | 'DARK';
export type DateFormatTypes = 'MM_DD_YYYY' | 'DD_MM_YYYY' | 'YYYY_MM_DD';
export type LanguageTypes = 'EN' | 'ES';

// ============================================
// Task Types
// ============================================
export interface Task {
  id: number;
  taskName: string;
  description?: string | null;
  dueDate?: string | null;
  priority: PriorityTypes;
  status: StatusTypes;
  authorId: number;
  listId?: number | null;
  archived: boolean;
}

// ============================================
// List Types
// ============================================
export interface List {
  id: number;
  title: string;
  description?: string | null;
  color: string;
  isFavorite: boolean;
  authorId: number;
  tasks?: Task[];
  createdAt?: string;
}

export interface CreateListDto {
  title: string;
  description?: string;
  color: string;
}

export interface UpdateListDto extends Partial<CreateListDto> {}

// ============================================
// Settings Types
// ============================================
export interface Settings {
  id: number;
  theme: ThemeTypes;
  dateFormat: DateFormatTypes;
  language: LanguageTypes;
  defaultPriority: PriorityTypes;
  defaultStatus: StatusTypes;
  userId: number;
}

export interface UpdateSettingsDto extends Partial<
  Omit<Settings, 'id' | 'userId'>
> {}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

// ============================================
// UI Types
// ============================================
export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}
