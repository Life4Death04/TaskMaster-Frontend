import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskFormData } from '@/schemas/task.schemas';
import { useFetchSettings } from '@/api/queries/settings.queries';
import { useFetchLists } from '@/api/queries/lists.queries';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskFormData) => void;
    isLoading?: boolean;
    defaultListId?: number;
}

export const CreateTaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
    defaultListId
}: CreateTaskModalProps) => {
    // Fetch user settings for default values
    const { data: settings } = useFetchSettings();
    const { data: lists = [] } = useFetchLists();

    // Determine default values from settings or fallback
    const defaultStatus = settings?.defaultStatus || 'TODO';
    const defaultPriority = settings?.defaultPriority || 'MEDIUM';

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            taskName: '',
            description: '',
            status: defaultStatus,
            dueDate: '',
            priority: defaultPriority,
            listId: defaultListId,
        },
    });

    const priority = watch('priority');

    const handleFormSubmit = handleSubmit((data: CreateTaskFormData) => {
        console.log('Form Data:', data);
        onSubmit(data);
        reset();
        onClose();
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
                <div className="flex items-start justify-between p-6 pb-4 border-b border-border-default">
                    <div>
                        <h2 className="text-text-primary text-xl font-bold mb-1">Create New Task</h2>
                        <p className="text-text-secondary text-sm">Organize your work and stay productive.</p>
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
                                Task Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Deploy system review"
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
                                Description
                            </label>
                            <textarea
                                placeholder="Provide more context about this task..."
                                {...register('description')}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* Status and Due Date Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Status */}
                            <div>
                                <label className="block text-text-primary text-sm font-semibold mb-2">
                                    Status
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
                                    <option value="TODO">To Do</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1">
                                    <span className="font-semibold text-text-primary">Due Date</span>
                                    <span className="text-xs">(OPTIONAL)</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('dueDate')}
                                    className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        {/* Priority and List Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Priority */}
                            <div>
                                <label className="block text-text-primary text-sm font-semibold mb-2">
                                    Priority
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'LOW')}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:cursor-pointer ${priority === 'LOW'
                                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-green-500/50'
                                            }`}
                                    >
                                        Low
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'MEDIUM')}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:cursor-pointer ${priority === 'MEDIUM'
                                            ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-orange-500/50'
                                            }`}
                                    >
                                        Med
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setValue('priority', 'HIGH')}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:cursor-pointer ${priority === 'HIGH'
                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                            : 'bg-background-input text-text-secondary border border-border-input hover:border-red-500/50'
                                            }`}
                                    >
                                        High
                                    </button>
                                </div>
                            </div>

                            {/* List - Hidden for now, will be implemented later */}
                            <div>
                                <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1">
                                    <span className="font-semibold text-text-primary">List</span>
                                    <span className="text-xs">(OPTIONAL)</span>
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
                                    <option value="">No List</option>
                                    {lists.map((list) => (
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
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
