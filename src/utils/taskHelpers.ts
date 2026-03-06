/**
 * Task Helper Utilities
 * Reusable functions for task-related UI logic
 */

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
  status?: string,
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
  priority?: string,
  t?: TranslationFunction
): BadgeStyle => {
  switch (priority?.toUpperCase()) {
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
export const getPriorityColor = (
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
): string => {
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
  format: string = 'MM_DD_YYYY',
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
