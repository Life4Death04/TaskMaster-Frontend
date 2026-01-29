import { useState, useRef, useEffect } from 'react';

interface TaskOptionsMenuProps {
    taskId: string;
    onEdit?: (id: string) => void;
    onArchive?: (id: string) => void;
    onDelete?: (id: string) => void;
}

/**
 * Task Options Menu Component
 * Reusable dropdown menu for task actions (Edit, Archive, Delete)
 */
export const TaskOptionsMenu = ({
    taskId,
    onEdit,
    onArchive,
    onDelete,
}: TaskOptionsMenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Type guard to check if target is a Node
            if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isMenuOpen]);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleEdit = () => {
        setIsMenuOpen(false);
        onEdit?.(taskId);
    };

    const handleArchive = () => {
        setIsMenuOpen(false);
        onArchive?.(taskId);
    };

    const handleDelete = () => {
        setIsMenuOpen(false);
        onDelete?.(taskId);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={handleMenuToggle}
                className="p-2 h-fit hover:bg-background-primary-hover hover:cursor-pointer rounded-lg transition-colors text-text-secondary hover:text-text-primary"
                aria-label="Task options"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="absolute bg-background-primary right-0 top-full mt-2 w-48 bg-card-dark border border-border-default rounded-lg shadow-2xl overflow-hidden z-50">
                    <button
                        onClick={handleEdit}
                        className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-primary-hover hover:cursor-pointer transition-colors flex items-center gap-3"
                    >
                        <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="font-medium">Edit</span>
                    </button>
                    <button
                        onClick={handleArchive}
                        className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-primary-hover hover:cursor-pointer transition-colors flex items-center gap-3 border-t border-border-default"
                    >
                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="font-medium">Archive</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full px-4 py-3 text-left text-red-400 hover:bg-red-500/10 hover:cursor-pointer transition-colors flex items-center gap-3 border-t border-border-default"
                    >
                        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-medium">Delete</span>
                    </button>
                </div>
            )}
        </div>
    );
};
