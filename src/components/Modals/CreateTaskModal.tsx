import { useState } from 'react';

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('TODO');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
    const [listId, setListId] = useState('personal');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
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
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors p-1"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* Task Name */}
                    <div>
                        <label className="block text-text-primary text-sm font-semibold mb-2 border-border-input">
                            Task Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Deploy system review"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-background-input border border-border-default rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-text-primary text-sm font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            placeholder="Provide more context about this task..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                    </div>

                    {/* Status and Due Date Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
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
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
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
                                    onClick={() => setPriority('LOW')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${priority === 'LOW'
                                        ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                        : 'bg-background-input text-text-secondary border border-border-input hover:border-green-500/50'
                                        }`}
                                >
                                    Low
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriority('MEDIUM')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${priority === 'MEDIUM'
                                        ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500'
                                        : 'bg-background-input text-text-secondary border border-border-input hover:border-orange-500/50'
                                        }`}
                                >
                                    Med
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPriority('HIGH')}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${priority === 'HIGH'
                                        ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                        : 'bg-background-input text-text-secondary border border-border-input hover:border-red-500/50'
                                        }`}
                                >
                                    High
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div>
                            <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1">
                                <span className="font-semibold text-text-primary">List</span>
                                <span className="text-xs">(OPTIONAL)</span>
                            </label>
                            <select
                                value={listId}
                                onChange={(e) => setListId(e.target.value)}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.25rem',
                                }}
                            >
                                <option value="personal">Personal</option>
                                <option value="work">Work</option>
                                <option value="shopping">Shopping</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border-default">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-background-primary-hover hover:bg-border-dark text-text-primary rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover text-white rounded-lg font-medium transition-colors shadow-lg"
                    >
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};
