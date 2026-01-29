/**
 * Task Helper Utilities
 * Reusable functions for task-related UI logic
 */

interface BadgeStyle {
  bg: string;
  text: string;
  label: string;
}

/**
 * Get status badge styling based on task status
 * @param status - The task status (TODO, IN_PROGRESS, DONE)
 * @returns Badge styling object with background, text color, and label
 */
export const getStatusBadge = (status?: string): BadgeStyle => {
  switch (status) {
    case 'IN_PROGRESS':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        label: 'IN PROGRESS',
      };
    case 'DONE':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: 'COMPLETED',
      };
    case 'TODO':
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: 'TO DO',
      };
  }
};

/**
 * Get priority badge styling based on task priority
 * @param priority - The task priority (LOW, MEDIUM, HIGH)
 * @returns Badge styling object with background, text color, and label
 */
export const getPriorityBadge = (priority?: string): BadgeStyle => {
  switch (priority?.toUpperCase()) {
    case 'HIGH':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        label: 'HIGH PRIORITY',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        label: 'MEDIUM PRIORITY',
      };
    case 'LOW':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        label: 'LOW PRIORITY',
      };
    default:
      return {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        label: 'NO PRIORITY',
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

/**
 * Get label color styling based on label text
 * @param label - The task label text
 * @returns Tailwind CSS color classes
 */
export const getLabelColor = (label?: string): string => {
  if (!label) return '';
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes('overdue')) return 'bg-red-500/20 text-red-400';
  if (lowerLabel.includes('dev') || lowerLabel.includes('in dev')) return 'bg-blue-500/20 text-blue-400';
  if (lowerLabel.includes('marketing')) return 'bg-purple-500/20 text-purple-400';
  return 'bg-gray-500/20 text-gray-400';
};
