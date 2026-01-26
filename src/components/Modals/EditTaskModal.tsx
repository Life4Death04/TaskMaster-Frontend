import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editTaskSchema, type EditTaskFormData } from '@/schemas/task.schemas';
import { useFetchLists } from '@/api/queries/lists.queries';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EditTaskFormData) => void;
    isLoading?: boolean;
    task?: {
        id: number;
        taskName: string;
        description?: string | null;
        status: 'TODO' | 'IN_PROGRESS' | 'DONE';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        dueDate?: string | null;
        listId?: number | null;
    };
}

export const EditTaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    task
}: EditTaskModalProps) => {
    const { t } = useTranslation();
    // Fetch all lists for the dropdown
    const { data: listsData } = useFetchLists();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EditTaskFormData>({
        resolver: zodResolver(editTaskSchema),
        defaultValues: {
            taskName: task?.taskName || '',
            description: task?.description || '',
            status: task?.status || 'TODO',
            dueDate: task?.dueDate || '',
            priority: task?.priority || 'MEDIUM',
            listId: task?.listId || undefined,
        },
    });

    const priority = watch('priority');

    // Update form when task prop changes
    useEffect(() => {
        if (task) {
            reset({
                taskName: task.taskName,
                description: task.description || '',
                status: task.status,
                dueDate: task.dueDate || '',
                priority: task.priority,
                listId: task.listId || undefined,
            });
        }
    }, [task, reset]);

    const handleFormSubmit = handleSubmit((data) => {
        onSubmit(data);
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg mx-4 bg-background-primary border border-border-default rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border-default">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <h2 className="text-text-primary text-xl font-bold">{t('modals.editTask.title')}</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        type="button"
                        className="text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors p-1"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleFormSubmit}>
                    {/* Content */}
                    <div className="p-6 space-y-5">
                        {/* Task Name */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-2">
                                {t('modals.createTask.taskName')}
                            </label>
                            <input
                                type="text"
                                {...register('taskName')}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                            {errors.taskName && (
                                <p className="text-red-400 text-xs mt-1">{errors.taskName.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-2">
                                {t('modals.createTask.description')}
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Status and Priority Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Status */}
                            <div>
                                <label className="block text-text-primary text-sm font-semibold mb-2">
                                    {t('modals.createTask.status')}
                                </label>
                                <select
                                    {...register('status')}
                                    className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '1.25rem',
                                    }}
                                >
                                    <option value="TODO">{t('common.status.todo')}</option>
                                    <option value="IN_PROGRESS">{t('common.status.inProgress')}</option>
                                    <option value="DONE">{t('common.status.done')}</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-text-primary text-sm font-semibold mb-2">
                                    {t('modals.createTask.priority')}
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'LOW')}
                                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all hover:cursor-pointer ${priority === 'LOW'
                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-green-500/50'
                                            }`}
                                    >
                                        {t('common.priority.low')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'MEDIUM')}
                                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all hover:cursor-pointer ${priority === 'MEDIUM'
                                            ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-orange-500/50'
                                            }`}
                                    >
                                        {t('common.priority.medium')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'HIGH')}
                                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all hover:cursor-pointer ${priority === 'HIGH'
                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-red-500/50'
                                            }`}
                                    >
                                        {t('common.priority.high')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Due Date and List Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Due Date */}
                            <div>
                                <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1">
                                    <span className="font-semibold text-text-primary">{t('modals.createTask.dueDate')}</span>
                                    <span className="text-xs">({t('common.optional')})</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('dueDate')}
                                    className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>

                            {/* List */}
                            <div>
                                <label className="block text-text-primary text-sm font-semibold mb-2">
                                    {t('modals.createTask.list')}
                                </label>
                                <select
                                    {...register('listId', {
                                        setValueAs: (value) => (value === '' ? undefined : Number(value)),
                                    })}
                                    className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundSize: '1.25rem',
                                    }}
                                >
                                    <option value="">{t('modals.createTask.noList')}</option>
                                    {listsData?.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border-default">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 bg-background-primary-hover hover:bg-border-dark hover:cursor-pointer text-text-primary rounded-lg font-medium transition-colors"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('common.saving') : t('common.saveChanges')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
