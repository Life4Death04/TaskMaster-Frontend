import { useTranslation } from 'react-i18next';
import { PageHeader } from '../common/PageHeader';
import { ListCard } from './ListCard';
import type { Task } from '@/types';

interface List {
    id: string;
    title: string;
    description: string;
    color: string;
    taskCount: number;
    tasks: Task[];
}

interface ListsViewProps {
    userName: string;
    lists: List[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onListClick: (id: string) => void;
    onCreateList: () => void;
}

/**
 * Lists View Component
 * Pure presentational component for the lists page layout
 */
export const ListsView = ({
    userName,
    lists,
    searchQuery,
    onSearchChange,
    onListClick,
    onCreateList,
}: ListsViewProps) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-background-primary p-6">
            {/* Page Header */}
            <PageHeader
                title={t('lists.title')}
                subtitle={t('lists.subtitle')}
                userName={userName}
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                showSearch={true}
            />

            {/* Create Button */}
            <div className="mb-8 flex justify-end">
                {/* Create New List Button */}
                <button
                    onClick={onCreateList}
                    className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-md hover:shadow-lg hover:cursor-pointer"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('lists.createNewList')}
                </button>
            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lists.map((list) => (
                    <ListCard
                        key={list.id}
                        id={list.id}
                        title={list.title}
                        description={list.description}
                        color={list.color}
                        taskCount={list.taskCount}
                        onClick={() => onListClick(list.id)}
                    />
                ))}

                {/* Create New List Card only when lists exist */}
                {lists.length > 0 && (
                    <ListCard
                        id="new"
                        title=""
                        description=""
                        color=""
                        taskCount={0}
                        isNewCard={true}
                        onClick={onCreateList}
                    />
                )}
            </div>

            {/* Empty State */}
            {lists.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 rounded-full bg-background-primary-hover flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-text-primary text-xl font-semibold mb-2">{t('lists.noListsFound')}</h3>
                    <p className="text-text-secondary text-sm mb-6">{t('lists.createFirstList')}</p>
                    <button
                        onClick={onCreateList}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors flex items-center gap-2 hover:cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {t('lists.createNewList')}
                    </button>
                </div>
            )}
        </div>
    );
};
