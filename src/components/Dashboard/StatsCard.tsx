import { type ReactNode } from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    variant?: 'default' | 'action';
    children?: ReactNode;
}

/**
 * Stats Card Component
 * Displays dashboard statistics like total tasks, completed today, overdue, etc.
 */
export const StatsCard = ({ title, value, icon, variant = 'default', children }: StatsCardProps) => {
    return (
        <div className="bg-card-primary rounded-xl p-6 border border-border-default shadow-md sm:h-fit md:h-26 lg:h-fit">
            {variant === 'default' ? (
                <div className="flex items-start gap-4">
                    <div className="bg-transparent size-10 m-auto rounded-lg bg-primary/10 text-primary flex-shrink-0 ">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium text-text-secondary uppercase tracking-wide">{title}</p>
                        <p className="text-2xl font-black text-text-primary">{value}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-text-secondary text-xs font-semibold uppercase tracking-wide mb-4">{title}</p>
                    <div className="flex gap-2">{children}</div>
                </div>
            )}
        </div>
    );
};
