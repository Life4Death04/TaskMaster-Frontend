/**
 * Task Helper Utilities
 * Reusable functions for task-related UI logic
 */

import type { DateFormatTypes, PriorityTypes, StatusTypes } from '@/types';

interface BadgeStyle {
  bg: string;
  text: string;
  label: string;
}

type TranslationFunction = (key: string) => string;

/**
 * Get status badge styling based on task status
 * @param status - The task status (TODO, IN_PROGRESS, DONE)
 * @param t - Translation function from useTranslation hook
 * @returns Badge styling object with background, text color, and label
 */
export const getStatusBadge = (
  status?: StatusTypes,
  t?: TranslationFunction
): BadgeStyle => {
  switch (status) {
    case 'IN_PROGRESS':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        label: t ? t('common.statusBadge.inProgress') : 'IN PROGRESS',
      };
    case 'DONE':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: t ? t('common.statusBadge.completed') : 'COMPLETED',
      };
    case 'TODO':
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: t ? t('common.statusBadge.toDo') : 'TO DO',
      };
  }
};

/**
 * Get priority badge styling based on task priority
 * @param priority - The task priority (LOW, MEDIUM, HIGH)
 * @param t - Translation function from useTranslation hook
 * @returns Badge styling object with background, text color, and label
 */
export const getPriorityBadge = (
  priority?: PriorityTypes,
  t?: TranslationFunction
): BadgeStyle => {
  switch (priority) {
    case 'HIGH':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        label: t ? t('common.priorityBadge.highPriority') : 'HIGH PRIORITY',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        label: t ? t('common.priorityBadge.mediumPriority') : 'MEDIUM PRIORITY',
      };
    case 'LOW':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: t ? t('common.priorityBadge.lowPriority') : 'LOW PRIORITY',
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: t ? t('common.priorityBadge.noPriority') : 'NO PRIORITY',
      };
  }
};

/**
 * Get priority color for dot indicators
 * @param priority - The task priority (HIGH, MEDIUM, LOW)
 * @returns Tailwind CSS color class
 */
export const getPriorityColor = (priority: PriorityTypes): string => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-500';
    case 'MEDIUM':
      return 'bg-orange-500';
    case 'LOW':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Format date based on user settings
 * @param dateString - The date string to format
 * @param format - The date format (MM_DD_YYYY, DD_MM_YYYY, YYYY_MM_DD)
 * @param t - Translation function from useTranslation hook
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | null | undefined,
  format: DateFormatTypes = 'MM_DD_YYYY',
  t: TranslationFunction
): string => {
  if (!dateString) return t('tasks.noDueDate');

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'DD_MM_YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY_MM_DD':
      return `${year}/${month}/${day}`;
    case 'MM_DD_YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
};

/**
 * Get label color styling based on label text
 * @param label - The task label text
 * @returns Tailwind CSS color classes
 */
export const getLabelColor = (label?: string): string => {
  if (!label) return '';
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('overdue')) return 'bg-red-500/20 text-red-400';
  if (lowerLabel.includes('dev') || lowerLabel.includes('in dev'))
    return 'bg-blue-500/20 text-blue-400';
  if (lowerLabel.includes('marketing'))
    return 'bg-purple-500/20 text-purple-400';
  return 'bg-gray-500/20 text-gray-400';
};

/**
 * Format a date based on user's date format preference with specific formatting
 * @param date - The date object to format
 * @param dateFormat - User's preferred date format
 * @returns Object with formatted date string and optional time
 */
export const formatTaskDate = (
  date: Date,
  dateFormat: DateFormatTypes
): { dateString: string; timeString?: string } => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let formattedDate = '';
  if (dateFormat === 'DD_MM_YYYY') {
    formattedDate = `${day}/${month}/${year}`;
  } else if (dateFormat === 'YYYY_MM_DD') {
    formattedDate = `${year}/${month}/${day}`;
  } else {
    // Default: MM_DD_YYYY
    formattedDate = `${month}/${day}/${year}`;
  }

  return { dateString: formattedDate };
};

/**
 * Sort tasks by priority (HIGH -> MEDIUM -> LOW)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array (does not mutate original)
 */
export const sortTasksByPriority = <T extends { priority: PriorityTypes }>(
  tasks: T[]
): T[] => {
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  return [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
};

/**
 * Sort tasks by due date (earliest first, tasks without dates last)
 * @param tasks - Array of tasks to sort
 * @returns Sorted array (does not mutate original)
 */
export const sortTasksByDueDate = <T extends { dueDate?: string | null }>(
  tasks: T[]
): T[] => {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
};

/**
 * Filter tasks by search query (searches taskName and description)
 * @param tasks - Array of tasks to filter
 * @param query - Search query string
 * @returns Filtered array
 */
export const filterTasksBySearch = <
  T extends { taskName: string; description?: string | null },
>(
  tasks: T[],
  query: string
): T[] => {
  if (!query.trim()) return tasks;
  const lowerQuery = query.toLowerCase();
  return tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Check if a task is overdue
 * @param task - Task to check
 * @returns True if task is overdue (has dueDate in past and not completed)
 */
export const isTaskOverdue = (task: {
  dueDate?: string | null;
  status: StatusTypes;
}): boolean => {
  return (
    !!task.dueDate &&
    task.status !== 'DONE' &&
    new Date(task.dueDate) < new Date()
  );
};

/**
 * Filter tasks by status based on UI filter tabs
 * Maps UI filter values ('todo', 'in_progress', 'done', 'completed') to StatusTypes
 * @param tasks - Array of tasks to filter
 * @param filter - UI filter value ('all' returns all tasks)
 * @returns Filtered tasks array
 */
export const filterTasksByStatus = <T extends { status: StatusTypes }>(
  tasks: T[],
  filter: 'all' | 'todo' | 'in_progress' | 'done' | 'completed'
): T[] => {
  // Return all tasks if 'all' filter is selected
  if (filter === 'all') return tasks;

  // Map UI filter values to StatusTypes
  const statusMap: Record<string, StatusTypes> = {
    todo: 'TODO',
    in_progress: 'IN_PROGRESS',
    done: 'DONE',
    completed: 'DONE', // 'completed' also maps to 'DONE'
  };

  const targetStatus = statusMap[filter];
  return tasks.filter((task) => task.status === targetStatus);
};
