import { test, expect } from '@playwright/test';
import {
  getStatusBadge,
  getPriorityBadge,
  getPriorityColor,
  formatDate,
  getLabelColor,
  formatTaskDate,
  sortTasksByPriority,
  sortTasksByDueDate,
  filterTasksBySearch,
  isTaskOverdue,
  filterTasksByStatus,
} from '../../src/utils/taskHelpers';
import type { PriorityTypes, StatusTypes, DateFormatTypes } from '../../src/types';

test.describe('taskHelpers - Badge Functions', () => {
  test('getStatusBadge returns correct badge for TODO status', () => {
    const badge = getStatusBadge('TODO');
    expect(badge.bg).toBe('bg-gray-500/20');
    expect(badge.text).toBe('text-gray-400');
    expect(badge.label).toBe('TO DO');
  });

  test('getStatusBadge returns correct badge for IN_PROGRESS status', () => {
    const badge = getStatusBadge('IN_PROGRESS');
    expect(badge.bg).toBe('bg-blue-500/20');
    expect(badge.text).toBe('text-blue-400');
    expect(badge.label).toBe('IN PROGRESS');
  });

  test('getStatusBadge returns correct badge for DONE status', () => {
    const badge = getStatusBadge('DONE');
    expect(badge.bg).toBe('bg-green-500/20');
    expect(badge.text).toBe('text-green-400');
    expect(badge.label).toBe('COMPLETED');
  });

  test('getStatusBadge uses translation function when provided', () => {
    const mockT = (key: string) => `translated_${key}`;
    const badge = getStatusBadge('TODO', mockT);
    expect(badge.label).toBe('translated_common.statusBadge.toDo');
  });

  test('getPriorityBadge returns correct badge for HIGH priority', () => {
    const badge = getPriorityBadge('HIGH');
    expect(badge.bg).toBe('bg-red-500/20');
    expect(badge.text).toBe('text-red-400');
    expect(badge.label).toBe('HIGH PRIORITY');
  });

  test('getPriorityBadge returns correct badge for MEDIUM priority', () => {
    const badge = getPriorityBadge('MEDIUM');
    expect(badge.bg).toBe('bg-orange-500/20');
    expect(badge.text).toBe('text-orange-400');
    expect(badge.label).toBe('MEDIUM PRIORITY');
  });

  test('getPriorityBadge returns correct badge for LOW priority', () => {
    const badge = getPriorityBadge('LOW');
    expect(badge.bg).toBe('bg-green-500/20');
    expect(badge.text).toBe('text-green-400');
    expect(badge.label).toBe('LOW PRIORITY');
  });

  test('getPriorityBadge returns default badge for undefined priority', () => {
    const badge = getPriorityBadge(undefined);
    expect(badge.bg).toBe('bg-gray-500/20');
    expect(badge.text).toBe('text-gray-400');
    expect(badge.label).toBe('NO PRIORITY');
  });
});

test.describe('taskHelpers - Priority Color', () => {
  test('getPriorityColor returns red for HIGH priority', () => {
    expect(getPriorityColor('HIGH')).toBe('bg-red-500');
  });

  test('getPriorityColor returns orange for MEDIUM priority', () => {
    expect(getPriorityColor('MEDIUM')).toBe('bg-orange-500');
  });

  test('getPriorityColor returns green for LOW priority', () => {
    expect(getPriorityColor('LOW')).toBe('bg-green-500');
  });
});

test.describe('taskHelpers - Date Formatting', () => {
  const mockT = (key: string) => key === 'tasks.noDueDate' ? 'No due date' : key;

  test('formatDate handles null date', () => {
    const result = formatDate(null, 'MM_DD_YYYY', mockT);
    expect(result).toBe('No due date');
  });

  test('formatDate handles undefined date', () => {
    const result = formatDate(undefined, 'MM_DD_YYYY', mockT);
    expect(result).toBe('No due date');
  });

  test('formatDate formats date in MM_DD_YYYY format', () => {
    const result = formatDate('2026-03-15', 'MM_DD_YYYY', mockT);
    expect(result).toBe('03/15/2026');
  });

  test('formatDate formats date in DD_MM_YYYY format', () => {
    const result = formatDate('2026-03-15', 'DD_MM_YYYY', mockT);
    expect(result).toBe('15/03/2026');
  });

  test('formatDate formats date in YYYY_MM_DD format', () => {
    const result = formatDate('2026-03-15', 'YYYY_MM_DD', mockT);
    expect(result).toBe('2026/03/15');
  });

  test('formatDate uses default format when not specified', () => {
    const result = formatDate('2026-12-25', undefined, mockT);
    expect(result).toBe('12/25/2026');
  });

  test('formatTaskDate formats date correctly in DD_MM_YYYY', () => {
    const date = new Date('2026-03-15');
    const result = formatTaskDate(date, 'DD_MM_YYYY');
    expect(result.dateString).toBe('15/03/2026');
  });

  test('formatTaskDate formats date correctly in YYYY_MM_DD', () => {
    const date = new Date('2026-03-15');
    const result = formatTaskDate(date, 'YYYY_MM_DD');
    expect(result.dateString).toBe('2026/03/15');
  });

  test('formatTaskDate formats date correctly in MM_DD_YYYY', () => {
    const date = new Date('2026-03-15');
    const result = formatTaskDate(date, 'MM_DD_YYYY');
    expect(result.dateString).toBe('03/15/2026');
  });
});

test.describe('taskHelpers - Label Color', () => {
  test('getLabelColor returns red for overdue labels', () => {
    expect(getLabelColor('Overdue')).toBe('bg-red-500/20 text-red-400');
    expect(getLabelColor('OVERDUE Task')).toBe('bg-red-500/20 text-red-400');
  });

  test('getLabelColor returns blue for dev labels', () => {
    expect(getLabelColor('In Dev')).toBe('bg-blue-500/20 text-blue-400');
    expect(getLabelColor('Development')).toBe('bg-blue-500/20 text-blue-400');
  });

  test('getLabelColor returns purple for marketing labels', () => {
    expect(getLabelColor('Marketing')).toBe('bg-purple-500/20 text-purple-400');
  });

  test('getLabelColor returns default gray for unknown labels', () => {
    expect(getLabelColor('Design')).toBe('bg-gray-500/20 text-gray-400');
  });

  test('getLabelColor returns empty string for undefined', () => {
    expect(getLabelColor(undefined)).toBe('');
  });
});

test.describe('taskHelpers - Sorting Functions', () => {
  const mockTasks = [
    { id: 1, priority: 'LOW' as PriorityTypes, taskName: 'Task 1', dueDate: '2026-03-20' },
    { id: 2, priority: 'HIGH' as PriorityTypes, taskName: 'Task 2', dueDate: '2026-03-15' },
    { id: 3, priority: 'MEDIUM' as PriorityTypes, taskName: 'Task 3', dueDate: null },
  ];

  test('sortTasksByPriority sorts HIGH > MEDIUM > LOW', () => {
    const sorted = sortTasksByPriority(mockTasks);
    expect(sorted[0].priority).toBe('HIGH');
    expect(sorted[1].priority).toBe('MEDIUM');
    expect(sorted[2].priority).toBe('LOW');
  });

  test('sortTasksByPriority does not mutate original array', () => {
    const original = [...mockTasks];
    sortTasksByPriority(mockTasks);
    expect(mockTasks).toEqual(original);
  });

  test('sortTasksByDueDate sorts earliest first', () => {
    const sorted = sortTasksByDueDate(mockTasks);
    expect(sorted[0].dueDate).toBe('2026-03-15');
    expect(sorted[1].dueDate).toBe('2026-03-20');
    expect(sorted[2].dueDate).toBeNull();
  });

  test('sortTasksByDueDate puts tasks without dates last', () => {
    const sorted = sortTasksByDueDate(mockTasks);
    expect(sorted[sorted.length - 1].dueDate).toBeNull();
  });

  test('sortTasksByDueDate does not mutate original array', () => {
    const original = [...mockTasks];
    sortTasksByDueDate(mockTasks);
    expect(mockTasks).toEqual(original);
  });
});

test.describe('taskHelpers - Filter Functions', () => {
  const mockTasks = [
    { taskName: 'Buy groceries', description: 'Milk and bread', status: 'TODO' as StatusTypes },
    { taskName: 'Write report', description: 'Quarterly report', status: 'IN_PROGRESS' as StatusTypes },
    { taskName: 'Fix bug', description: null, status: 'DONE' as StatusTypes },
    { taskName: 'Review code', description: 'PR #123', status: 'TODO' as StatusTypes },
  ];

  test('filterTasksBySearch filters by task name', () => {
    const filtered = filterTasksBySearch(mockTasks, 'buy');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].taskName).toBe('Buy groceries');
  });

  test('filterTasksBySearch filters by description', () => {
    const filtered = filterTasksBySearch(mockTasks, 'quarterly');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].taskName).toBe('Write report');
  });

  test('filterTasksBySearch is case insensitive', () => {
    const filtered = filterTasksBySearch(mockTasks, 'BUY');
    expect(filtered).toHaveLength(1);
  });

  test('filterTasksBySearch returns all tasks for empty query', () => {
    const filtered = filterTasksBySearch(mockTasks, '');
    expect(filtered).toHaveLength(4);
  });

  test('filterTasksBySearch returns empty array when no matches', () => {
    const filtered = filterTasksBySearch(mockTasks, 'nonexistent');
    expect(filtered).toHaveLength(0);
  });

  test('filterTasksByStatus returns all tasks for "all" filter', () => {
    const filtered = filterTasksByStatus(mockTasks, 'all');
    expect(filtered).toHaveLength(4);
  });

  test('filterTasksByStatus filters TODO tasks', () => {
    const filtered = filterTasksByStatus(mockTasks, 'todo');
    expect(filtered).toHaveLength(2);
    filtered.forEach(task => expect(task.status).toBe('TODO'));
  });

  test('filterTasksByStatus filters IN_PROGRESS tasks', () => {
    const filtered = filterTasksByStatus(mockTasks, 'in_progress');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('IN_PROGRESS');
  });

  test('filterTasksByStatus filters DONE tasks', () => {
    const filtered = filterTasksByStatus(mockTasks, 'done');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('DONE');
  });

  test('filterTasksByStatus handles "completed" alias for DONE', () => {
    const filtered = filterTasksByStatus(mockTasks, 'completed');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('DONE');
  });
});

test.describe('taskHelpers - Overdue Check', () => {
  test('isTaskOverdue returns true for past date and not completed', () => {
    const task = {
      dueDate: '2026-01-01',
      status: 'TODO' as StatusTypes,
    };
    expect(isTaskOverdue(task)).toBe(true);
  });

  test('isTaskOverdue returns false for future date', () => {
    const task = {
      dueDate: '2027-12-31',
      status: 'TODO' as StatusTypes,
    };
    expect(isTaskOverdue(task)).toBe(false);
  });

  test('isTaskOverdue returns false for completed task even with past date', () => {
    const task = {
      dueDate: '2026-01-01',
      status: 'DONE' as StatusTypes,
    };
    expect(isTaskOverdue(task)).toBe(false);
  });

  test('isTaskOverdue returns false for task without due date', () => {
    const task = {
      dueDate: null,
      status: 'TODO' as StatusTypes,
    };
    expect(isTaskOverdue(task)).toBe(false);
  });
});
