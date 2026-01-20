import { TaskOptionsMenu } from '../common/TaskOptionsMenu';

interface TaskItemProps {
    id: string;
    title: string;
    description: string;
    status: 'overdue' | 'normal' | 'completed';
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
    onToggleComplete: (id: string) => void;
    onClick?: (id: string) => void;
    onEdit?: (id: string) => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
}

/**
 * Task Item Component
 * Displays a single task with all its details in the Recent Tasks list
 */
export const TaskItem = ({
    id,
    title,
    description,
    status,
    dueDate,
    dueTime,
    priority,
    onToggleComplete,
    onClick,
    onEdit,
    onArchive,
    onDelete,
}: TaskItemProps) => {
    return (
        <div
            className="flex gap-3 p-4 rounded-lg bg-card-primary hover:bg-background-primary-hover transition-colors border border-border-default hover:border-border-dark hover:cursor-pointer shadow-md"
            onClick={() => onClick?.(id)}
        >
            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={status === 'completed'}
                    onChange={() => onToggleComplete(id)}
                    className="w-5 h-5 rounded border-2 border-border-dark bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-text-primary font-semibold text-sm">{title}</h3>
                    {status === 'overdue' && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-400 rounded uppercase">OVERDUE</span>
                    )}
                    {status === 'normal' && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-blue-500/20 text-blue-400 rounded uppercase">NORMAL</span>
                    )}
                </div>

                <p className="text-text-secondary text-sm my-3">{description}</p>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-text-secondary">{dueDate}</span>
                        {dueTime && <span className="text-primary font-medium">{dueTime}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${priority === 'high' ? 'bg-red-500' :
                            priority === 'medium' ? 'bg-orange-500' :
                                'bg-green-500'
                            }`}></span>
                        <span className="text-text-secondary text-xs capitalize">{priority}</span>
                    </div>

                    <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                        <TaskOptionsMenu
                            taskId={id}
                            onEdit={onEdit}
                            onArchive={onArchive}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
