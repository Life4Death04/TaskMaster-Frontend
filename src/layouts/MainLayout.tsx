import { type ReactNode } from 'react';
import { SidebarContainer } from '@/containers/SidebarContainer';

interface MainLayoutProps {
    children: ReactNode;
}

/**
 * Main Layout Component
 * Wraps pages with the sidebar and provides consistent layout structure
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <SidebarContainer />

            <main className="flex-1 overflow-y-auto transition-all duration-300 ml-19 lg:ml-50">
                <div className="container min-w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};
