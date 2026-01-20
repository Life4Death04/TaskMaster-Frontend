import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ListDetailsView } from '@/components/Lists/ListDetailsView';
import { useAppDispatch } from '@/hooks/redux';
import { openModal } from '@/features/ui/uiSlice';

type FilterTab = 'todo' | 'in_progress' | 'completed';

/**
 * List Details Container
 * Business logic for the List Details page
 */
export const ListDetailsContainer = () => {
    const { listId } = useParams<{ listId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('todo');

    // Mock data - will be replaced with Redux state/API call later
    const listData = {
        id: listId || '1',
        name: 'Q3 Marketing',
        color: 'bg-blue-500',
        description: 'Campaign launch',
        isFavorite: false,
    };

    const allTasks = [
        {
            id: '1',
            title: 'Finalize Social Media Assets',
            description: 'Create final versions of all social media graphics',
            label: 'HIGH',
            dueDate: 'Today',
            priority: 'high' as const,
            progressStatus: 'TODO' as const,
        },
        {
            id: '2',
            title: 'Draft Email Newsletter Copy',
            description: 'Write compelling copy for the newsletter campaign',
            label: 'MEDIUM',
            dueDate: 'Tomorrow',
            priority: 'medium' as const,
            progressStatus: 'DONE' as const,
        },
        {
            id: '3',
            title: 'Set Up Ad Campaigns for Instagram',
            description: 'Configure targeting and budget for Instagram ads',
            label: 'MEDIUM',
            dueDate: 'Oct 24',
            priority: 'medium' as const,
            progressStatus: 'IN_PROGRESS' as const,
        },
    ];

    // Filter tasks based on active filter
    const getFilteredTasks = () => {
        let filtered = allTasks;

        // Apply filter
        if (activeFilter === 'todo') {
            filtered = filtered.filter(task => task.progressStatus === 'TODO');
        } else if (activeFilter === 'in_progress') {
            filtered = filtered.filter(task => task.progressStatus === 'IN_PROGRESS');
        } else if (activeFilter === 'completed') {
            filtered = filtered.filter(task => task.progressStatus === 'DONE');
        }

        // Apply search
        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredTasks = getFilteredTasks();
    const activeTasks = allTasks.filter(task => task.progressStatus !== 'DONE').length;

    // Event handlers
    const handleBack = () => {
        navigate('/lists');
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filter: FilterTab) => {
        setActiveFilter(filter);
    };

    const handleToggleFavorite = () => {
        // TODO: Toggle favorite status
        console.log('Toggle favorite for list:', listId);
    };

    const handleCreateTask = () => {
        dispatch(openModal({ type: 'CREATE_TASK' }));
    };

    const handleTaskToggle = (id: string) => {
        // TODO: Toggle task completion
        console.log('Toggle task:', id);
    };

    const handleTaskClick = (id: string) => {
        const task = allTasks.find(t => t.id === id);
        if (task) {
            dispatch(openModal({
                type: 'TASK_DETAILS',
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.progressStatus,
                    priority: task.priority.toUpperCase(),
                    dueDate: task.dueDate,
                    listName: listData.name,
                },
            }));
        }
    };

    const handleEditTask = (id: string) => {
        const task = allTasks.find(t => t.id === id);
        if (task) {
            dispatch(openModal({
                type: 'EDIT_TASK',
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    status: task.progressStatus,
                    priority: task.priority.toUpperCase(),
                    dueDate: task.dueDate,
                    listName: listData.name,
                },
            }));
        }
    };

    const handleArchiveTask = (id: string) => {
        // TODO: Archive task
        console.log('Archive task:', id);
    };

    const handleDeleteTask = (id: string) => {
        const task = allTasks.find(t => t.id === id);
        if (task) {
            dispatch(openModal({
                type: 'DELETE_CONFIRMATION',
                data: {
                    itemName: task.title,
                    itemType: 'task',
                    onConfirm: () => {
                        // TODO: Implement actual delete logic here
                        console.log('Task deleted:', id);
                    },
                },
            }));
        }
    };

    const handleEditList = () => {
        dispatch(openModal({
            type: 'EDIT_LIST',
            data: {
                id: listData.id,
                name: listData.name,
                color: listData.color,
                description: listData.description,
            },
        }));
    };

    const handleDeleteList = () => {
        dispatch(openModal({
            type: 'DELETE_CONFIRMATION',
            data: {
                itemName: listData.name,
                itemType: 'list',
                onConfirm: () => {
                    // TODO: Implement actual delete logic here
                    console.log('List deleted:', listData.id);
                    navigate('/lists'); // Navigate back to lists page after deletion
                },
            },
        }));
    };

    return (
        <ListDetailsView
            listName={listData.name}
            listColor={listData.color}
            listDescription={listData.description}
            totalTasks={allTasks.length}
            activeTasks={activeTasks}
            tasks={filteredTasks}
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            isFavorite={listData.isFavorite}
            onBack={handleBack}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onToggleFavorite={handleToggleFavorite}
            onEditList={handleEditList}
            onDeleteList={handleDeleteList}
            onCreateTask={handleCreateTask}
            onTaskToggle={handleTaskToggle}
            onTaskClick={handleTaskClick}
            onEditTask={handleEditTask}
            onArchiveTask={handleArchiveTask}
            onDeleteTask={handleDeleteTask}
        />
    );
};
