interface UpcomingDueDateItemProps {
    id: string;
    date: string;
    month: string;
    title: string;
    description: string;
    time?: string;
    priority?: 'high' | 'medium' | 'low';
    assignee?: string;
}

/**
 * Upcoming Due Date Item Component
 * Displays a single upcoming task in the due dates section
 */
export const UpcomingDueDateItem = ({
    date,
    month,
    title,
    description,
    time,
    priority,
    assignee,
}: UpcomingDueDateItemProps) => {
    return (
        <div className="flex gap-3 p-3 hover:bg-background-primary-hover transition-colors hover:rounded-lg">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-card-dark border border-border-default flex flex-col items-center justify-center">
                    <span className="text-text-secondary text-[10px] font-semibold uppercase">{month}</span>
                    <span className="text-text-primary text-lg font-bold leading-none">{date}</span>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <h4 className="text-text-primary font-semibold text-sm">{title}</h4>
                    {priority && (
                        <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                            {priority}
                        </span>
                    )}
                </div>
                <p className="text-text-secondary text-xs mb-2">{description}</p>
                {time && (
                    <div className="flex items-center gap-1 text-primary text-xs">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" strokeWidth={2} />
                            <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                        </svg>
                        <span>{time}</span>
                    </div>
                )}
            </div>

            {/* {assignee && (
                <div className="flex-shrink-0">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                        {assignee}
                    </div>
                </div>
            )} */}
        </div>
    );
};
