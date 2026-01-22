interface ListCardProps {
    id: string;
    title: string;
    description: string;
    color: string;
    taskCount: number;
    isNewCard?: boolean;
    onClick?: () => void;
}

/**
 * List Card Component
 * Displays a single list card with all its details
 */
export const ListCard = ({
    title,
    description,
    color,
    taskCount,
    isNewCard = false,
    onClick,
}: ListCardProps) => {
    if (isNewCard) {
        return (
            <button
                onClick={onClick}
                className="group h-full border-2 border-dashed border-border-default rounded-xl p-6 hover:border-primary hover:cursor-pointer hover:bg-background-primary-hover transition-all duration-300 flex flex-col items-center justify-center gap-3 max-h-[160px]"
            >
                <div className="w-12 h-12 rounded-full bg-background-primary-hover group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <svg className="w-6 h-6 text-text-secondary group-hover:text-primary transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <p className="text-text-secondary group-hover:text-text-primary font-medium transition-colors">
                    Create New List
                </p>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="group h-full bg-card-primary border border-border-default rounded-xl overflow-hidden hover:shadow-lg shadow-md hover:-translate-y-1 transition-all duration-300 text-left hover:cursor-pointer max-h-fit"
        >
            {/* Colored top border */}
            <div className='h-1.5' style={{ backgroundColor: color }}></div>

            <div className="p-6">
                {/* Title and Description */}
                <div className="mb-4">
                    <h3 className="text-text-primary text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-2">
                        {description}
                    </p>
                </div>

                {/* Task Count */}
                <div className="flex items-center gap-2 border-t border-border-default pt-2 text-text-secondary">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className={`text-sm font-medium text-[${color}]`}>{taskCount} tasks</span>
                </div>
            </div>
        </button>
    );
};
