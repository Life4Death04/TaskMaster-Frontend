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
export type UiLanguageTypes = 'en' | 'es';

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
// Shared View Model Types
// ============================================

export type TaskSortOption = 'recent' | 'dueDate' | 'priority';
export type TaskFilterTab = 'all' | 'todo' | 'in_progress' | 'done';
export type ListTaskFilterTab = 'all' | 'todo' | 'in_progress' | 'completed';
// AI said: Your dashboard/task-list view models are better as explicit types unless you refactor field names/types to match Task directly. Because the data could change through the time

// But I think that we could just create these types as subsets of Task with some transformations (like status mapping for recent tasks) to avoid duplication and ensure consistency. ASK LUIS ABOUT IT. For now, I'll define them explicitly to match the current structure of the components, but we can refactor later if needed.
export interface TaskViewModel {
  id: string;
  title: string;
  description: string;
  label?: string;
  dueDate: string;
  dueTime?: string;
  priority: PriorityTypes;
  progressStatus: StatusTypes;
}
export interface DashboardRecentTaskViewModel {
  id: string;
  title: string;
  description: string;
  status: 'overdue' | 'normal' | 'completed';
  dueDate: string;
  dueTime?: string;
  priority: PriorityTypes;
}

export interface DashboardUpcomingTaskViewModel {
  id: string;
  date: string;
  month: string;
  title: string;
  description: string;
  time?: string;
  priority?: PriorityTypes;
}

// ============================================
// Modal-specific Types
// ============================================

/**
 * Subset of Task properties needed for modals (Edit/Details)
 * Excludes authorId which is managed by the backend
 */
export type TaskModalData = Pick<
  Task,
  | 'id'
  | 'taskName'
  | 'description'
  | 'status'
  | 'priority'
  | 'dueDate'
  | 'listId'
>;

/**
 * Subset of List properties needed for Edit List modal
 */
export type ListModalData = Pick<
  List,
  'id' | 'title' | 'description' | 'color'
>;

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

export type DeleteConfirmationType = 'task' | 'list' | 'item';
// Discriminated union for type-safe modal handling
export type ModalPayload =
  | { type: 'CREATE_TASK'; data?: { defaultListId?: number } }
  | { type: 'EDIT_TASK'; data: TaskModalData }
  | { type: 'CREATE_LIST'; data?: never }
  | { type: 'EDIT_LIST'; data: ListModalData }
  | { type: 'TASK_DETAILS'; data: TaskModalData }
  | {
      type: 'DELETE_CONFIRMATION';
      data: {
        taskId?: number;
        listId?: number;
        itemName: string;
        itemType: DeleteConfirmationType;
        accountDelete?: boolean;
      };
    };

// ModalState is a discriminated union that properly narrows type and data together
export type ModalState =
  | { isOpen: false; type: null }
  | (ModalPayload & { isOpen: true });
