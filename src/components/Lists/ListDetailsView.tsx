import { useTranslation } from 'react-i18next';
import { TaskCard } from '../Tasks/TaskCard';
import { PageHeader } from '../common/PageHeader';
import { TaskFilterBar } from '../common/TaskFilterBar';

type FilterTab = 'all' | 'todo' | 'in_progress' | 'completed';
type SortOption = 'recent' | 'dueDate' | 'priority';

interface Task {
    id: string;
    title: string;
    description: string;
    label?: string;
    dueDate: string;
    dueTime?: string;
    priority: 'high' | 'medium' | 'low';
    progressStatus: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

interface ListDetailsViewProps {
    listName: string;
    listDescription?: string;
    totalTasks: number;
    activeTasks: number;
    tasks: Task[];
    activeFilter: FilterTab;
    searchQuery: string;
    sortOption: SortOption;
    isFavorite?: boolean;
    onBack: () => void;
    onSearchChange: (query: string) => void;
    onFilterChange: (filter: FilterTab) => void;
    onSortChange: (sort: SortOption) => void;
    onToggleFavorite?: () => void;
    onEditList?: () => void;
    onDeleteList?: () => void;
    onCreateTask: () => void;
    onTaskToggle: (id: string) => void;
    onTaskClick?: (id: string) => void;
    onEditTask?: (id: string) => void;
    onArchiveTask?: (id: string) => void;
    onDeleteTask?: (id: string) => void;
}

/**
 * List Details View Component
 * Displays all tasks within a specific list
 */
export const ListDetailsView = ({
    listName,
    listDescription,
    totalTasks,
    activeTasks,
    tasks,
    activeFilter,
    searchQuery,
    sortOption,
    isFavorite = false,
    onBack,
    onSearchChange,
    onFilterChange,
    onSortChange,
    onToggleFavorite,
    onEditList,
    onDeleteList,
    onCreateTask,
    onTaskToggle,
    onTaskClick,
    onEditTask,
    onArchiveTask,
    onDeleteTask,
}: ListDetailsViewProps) => {
    const { t } = useTranslation();

    const filterTabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: t('tasks.filter.all') },
        { key: 'todo', label: t('tasks.filter.todo') },
        { key: 'in_progress', label: t('tasks.filter.inProgress') },
        { key: 'completed', label: t('tasks.filter.completed') },
    ];

    const sortOptions: { key: SortOption; label: string }[] = [
        { key: 'recent', label: t('tasks.sort.recent') },
        { key: 'dueDate', label: t('tasks.sort.dueDate') },
        { key: 'priority', label: t('tasks.sort.priority') },
    ];

    // Action buttons for the header
    const actionButtons = (
        <>
            {/* Delete List Button */}
            <button
                onClick={onDeleteList}
                className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Delete list"
            >
                <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {/* Edit List Button */}
            <button
                onClick={onEditList}
                className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Edit list"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </button>

            {/* Favorite Icon */}
            <button
                onClick={onToggleFavorite}
                className="p-2 hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <svg
                    className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-text-secondary'}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-background-primary text-text-primary p-6">
            {/* Page Header*/}
            <div className="mb-6 flex items-center gap-4">
                <div className="flex-1">
                    <PageHeader
                        title={listName}
                        subtitle={`${listDescription ? listDescription + ' | ' : ''}${t('lists.totalTasks')}: ${totalTasks} | ${t('lists.completedTasks')}: ${activeTasks}`}
                        searchQuery={searchQuery}
                        onSearchChange={onSearchChange}
                        showSearch={true}
                        showBackButton={true}
                        onBack={onBack}
                        actionButtons={actionButtons}
                    />
                </div>
            </div>

            {/* Filter Bar with Create Task Button */}
            <TaskFilterBar
                filterTabs={filterTabs}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                onCreateTask={onCreateTask}
                showSort={true}
                sortOption={sortOption}
                sortOptions={sortOptions}
                onSortChange={onSortChange}
            />

            {/* Tasks List */}
            <div className="space-y-4">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        label={task.label}
                        dueDate={task.dueDate}
                        dueTime={task.dueTime}
                        priority={task.priority}
                        progressStatus={task.progressStatus}
                        onToggleComplete={onTaskToggle}
                        onClick={onTaskClick}
                        onEdit={onEditTask}
                        onArchive={onArchiveTask}
                        onDelete={onDeleteTask}
                    />
                ))}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 rounded-full bg-background-primary-hover flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">{t('tasks.noTasksFound')}</h3>
                    <p className="text-text-secondary text-sm mb-6">{t('tasks.createFirstTask')}</p>
                    <button
                        onClick={onCreateTask}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('tasks.createTask')}
                    </button>
                </div>
            )}
        </div>
    );
};