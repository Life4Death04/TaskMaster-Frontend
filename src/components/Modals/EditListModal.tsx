import { useState } from 'react';

interface EditListModalProps {
    isOpen: boolean;
    onClose: () => void;
    list?: {
        id: string;
        title: string;
        description: string;
        color: string;
    };
}

const COLORS = [
    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
    { name: 'Yellow', value: '#EAB308', class: 'bg-yellow-500' },
    { name: 'Green', value: '#10B981', class: 'bg-green-500' },
];

export const EditListModal = ({ isOpen, onClose, list }: EditListModalProps) => {
    const [listName, setListName] = useState(list?.title || '');
    const [description, setDescription] = useState(list?.description || '');
    const [selectedColor, setSelectedColor] = useState(list?.color || COLORS[1].value);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-card-dark border border-border-dark rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border-dark">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <h2 className="text-text-primary text-xl font-bold">Edit List</h2>
                        </div>
                        <p className="text-text-secondary text-sm">Update list details and preferences.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary hover:cursor-pointer transition-colors p-1"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5">
                    {/* List Name */}
                    <div>
                        <label className="block text-text-primary text-sm font-semibold mb-2">
                            List Name
                        </label>
                        <input
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-background-primary-hover border border-border-dark rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-text-primary text-sm font-semibold mb-2">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 bg-background-primary-hover border border-border-dark rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                        />
                    </div>

                    {/* List Color */}
                    <div>
                        <label className="block text-text-primary text-sm font-semibold mb-3">
                            List Color
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-10 h-10 rounded-full ${color.class} transition-transform hover:scale-110 hover:cursor-pointer ${selectedColor === color.value
                                        ? 'ring-4 ring-white/30 scale-110'
                                        : ''
                                        }`}
                                    aria-label={`Select ${color.name}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 pt-4 border-t border-border-dark">
                    <button
                        className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 hover:cursor-pointer text-red-500 rounded-lg font-medium transition-colors border border-red-500/30 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete List
                    </button>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-background-primary-hover hover:bg-border-dark hover:cursor-pointer text-text-primary rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2.5 bg-primary hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-medium transition-colors shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
