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
export const getStatusBadge = (status?: string, t?: TranslationFunction): BadgeStyle => {
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
export const getPriorityBadge = (priority?: string, t?: TranslationFunction): BadgeStyle => {
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
 * @param priority - The task priority (high, medium, low)
 * @returns Tailwind CSS color class
 */
export const getPriorityColor = (
  priority: 'high' | 'medium' | 'low'
): string => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-orange-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};
