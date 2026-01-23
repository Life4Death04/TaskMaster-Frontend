import React from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';
import { useToggleTaskStatus } from '@/api/mutations/tasks.mutations';
import { useFetchSettings } from '@/api/queries/settings.queries';
import { useFetchLists } from '@/api/queries/lists.queries';
import { getStatusBadge, getPriorityBadge } from '@/utils/taskHelpers';
import type { Task } from '@/types';

// Helper function to format date based on user settings
const formatDate = (dateString: string | null | undefined, format: string = 'MM_DD_YYYY'): string => {
    if (!dateString) return 'No due date';

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

interface TaskDetailsModalProps {
    onClose: () => void;
    task?: Task;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ onClose, task }) => {
    const dispatch = useAppDispatch();
    const toggleStatusMutation = useToggleTaskStatus();
    const { data: settings } = useFetchSettings();
    const { data: allLists = [] } = useFetchLists();
    const statusBadge = getStatusBadge(task?.status);
    const priorityBadge = getPriorityBadge(task?.priority);

    // Format the due date based on user settings
    const formattedDueDate = formatDate(task?.dueDate, settings?.dateFormat);

    // Find the list name for this task
    const taskList = task?.listId ? allLists.find(list => list.id === task.listId) : null;

    const handleMarkAsCompleted = async () => {
        if (!task?.id) return;

        try {
            await toggleStatusMutation.mutateAsync(task.id);
            onClose();
        } catch (error) {
            console.error('Failed to mark task as completed:', error);
        }
    };

    const handleDeleteClick = () => {
        if (!task?.id) return;

        // Close task details modal first
        onClose();

        // Open delete confirmation with task data (no functions in Redux!)
        dispatch(openModal({
            type: 'DELETE_CONFIRMATION',
            data: {
                taskId: task.id,
                itemName: task.taskName || 'this task',
                itemType: 'task',
            },
        }));
    };

    const handleEditClick = () => {
        if (!task) return;

        // Close current modal and open edit modal
        onClose();
        dispatch(openModal({
            type: 'EDIT_TASK',
            data: task,
        }));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl mx-4 bg-[#1e1e2e] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header with action buttons */}
                <div className="bg-background-primary flex items-center justify-between px-6 py-4 border-b border-border-default">
                    <div>
                        {/* Delete Button */}
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Delete task"
                        >
                            <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>

                        {/* Edit Button */}
                        <button
                            onClick={handleEditClick}
                            className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Edit task"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">


                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                            aria-label="Close modal"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-col lg:flex-row gap-6 bg-background-primary">
                    {/* Left Column - Main Content */}
                    <div className="flex-1 p-6">
                        {/* Task ID */}
                        <div className="mb-3">
                            <p className="text-xs font-semibold text-primary tracking-wider">
                                TASK ID: {task?.id || 'N/A'}
                            </p>
                        </div>

                        {/* Task Title */}
                        <h2 className="text-2xl font-bold text-text-primary mb-4">
                            {task?.taskName || 'Untitled Task'}
                        </h2>

                        {/* Status and Priority Badges */}
                        <div className="flex gap-3 mb-6">
                            {/* Status Badge */}
                            <span className={`px-3 py-1.5 ${statusBadge.bg} ${statusBadge.text} rounded-lg text-xs font-semibold flex items-center gap-1.5`}>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                {statusBadge.label}
                            </span>

                            {/* Priority Badge */}
                            <span className={`px-3 py-1.5 ${priorityBadge.bg} ${priorityBadge.text} rounded-lg text-xs font-semibold flex items-center gap-1.5`}>
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {priorityBadge.label}
                            </span>
                        </div>

                        {/* Description Section */}
                        <div>
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                                DESCRIPTION
                            </h3>
                            <p className="text-text-primary leading-relaxed text-sm">
                                {task?.description || 'No description available.'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Metadata */}
                    <div className="lg:w-64 space-y-6 bg-background-primary p-6 border-t lg:border-t-0 lg:border-l border-border-default">
                        {/* Due Date */}
                        <div>
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                DUE DATE
                            </h3>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-background-primary">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-text-primary font-semibold text-sm">{formattedDueDate}</p>
                                    <p className="text-text-secondary text-xs mt-0.5">Task deadline</p>
                                </div>
                            </div>
                        </div>

                        {/* Project / List */}
                        <div>
                            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                                PROJECT / LIST
                            </h3>
                            <div className="flex items-start gap-3 p-3 rounded-lg">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-text-primary font-semibold text-sm">
                                        {taskList ? taskList.title : 'No List'}
                                    </p>
                                    <p className="text-text-secondary text-xs mt-0.5">Task category</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleMarkAsCompleted}
                            disabled={toggleStatusMutation.isPending || task?.status === 'DONE'}
                            className="w-full py-3 bg-primary hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {toggleStatusMutation.isPending ? 'Updating...' : task?.status === 'DONE' ? 'Completed' : 'Mark as Complete'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};
