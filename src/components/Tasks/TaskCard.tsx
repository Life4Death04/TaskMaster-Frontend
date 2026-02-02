import { useTranslation } from 'react-i18next';
import { TaskOptionsMenu } from '../common/TaskOptionsMenu';
import { getPriorityColor, getLabelColor } from '@/utils/taskHelpers';

interface TaskCardProps {
    id: string;
    title: string;
    description: string;
    label?: string;
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
    progressStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';
    onToggleComplete: (id: string) => void;
    onClick?: (id: string) => void;
    onEdit?: (id: string) => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
}

/**
 * Task Card Component
 * Displays a single task with all its details in the My Tasks page
 */
export const TaskCard = ({
    id,
    title,
    description,
    label,
    dueDate,
    dueTime,
    priority,
    progressStatus,
    onToggleComplete,
    onClick,
    onEdit,
    onArchive,
    onDelete,
}: TaskCardProps) => {
    const { t } = useTranslation();
    const isCompleted = progressStatus === 'DONE';

    return (
        <div
            className="flex gap-4 p-4 bg-card-primary border border-border-default rounded-xl hover:border-border-input hover:shadow-lg shadow-md transition-all hover:cursor-pointer"
            onClick={() => onClick?.(id)}
        >
            {/* Checkbox */}
            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => onToggleComplete(id)}
                    className="w-5 h-5 rounded border-2 border-border-dark bg-transparent checked:bg-primary checked:border-primary cursor-pointer transition-colors"
                />
            </div>

            {/* Task Content */}
            <div className="flex-1 min-w-0">
                {/* Title and Label */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className={`text-text-primary font-semibold text-base ${isCompleted ? 'line-through opacity-60' : ''}`}>
                        {title}
                    </h3>
                    {label && (
                        <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase ${getLabelColor()}`}>
                            {label === 'OVERDUE' ? t('tasks.labels.overdue') : label}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-text-secondary text-sm mb-3">{description}</p>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Due Date */}
                    {dueDate && (
                        <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-text-secondary">{dueDate}</span>
                            {dueTime && <span className="text-primary font-medium">{dueTime}</span>}
                        </div>
                    )}

                    {/* Priority */}
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${getPriorityColor(priority)}`}></span>
                        <span className="text-text-secondary text-sm capitalize">
                            {priority === 'high' ? t('common.priority.high') :
                                priority === 'medium' ? t('common.priority.medium') :
                                    t('common.priority.low')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Menu Button */}
            <div onClick={(e) => e.stopPropagation()}>
                <TaskOptionsMenu
                    taskId={id}
                    onEdit={onEdit}
                    onArchive={onArchive}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
};
