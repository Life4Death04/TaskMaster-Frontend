import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateListSchema, type UpdateListFormData } from '@/schemas/list.schemas';

interface EditListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UpdateListFormData) => void;
    isLoading?: boolean;
    list?: {
        id: number;
        title: string;
        description?: string | null;
        color: string;
    };
}

const COLORS = [
    { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
    { name: 'Orange', value: '#F97316', class: 'bg-orange-500' },
    { name: 'Yellow', value: '#EAB308', class: 'bg-yellow-500' },
    { name: 'Green', value: '#10B981', class: 'bg-green-500' },
    { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' },
    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
];

export const EditListModal = ({ isOpen, onClose, onSubmit, isLoading = false, list }: EditListModalProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<UpdateListFormData>({
        resolver: zodResolver(updateListSchema),
        defaultValues: {
            title: list?.title || '',
            description: list?.description || '',
            color: list?.color || COLORS[0].value,
        },
    });

    const selectedColor = watch('color');

    // Update form when list data changes
    useEffect(() => {
        if (list) {
            reset({
                title: list.title,
                description: list.description || '',
                color: list.color,
            });
        }
    }, [list, reset]);

    const handleFormSubmit = handleSubmit((data: UpdateListFormData) => {
        onSubmit(data);
        reset();
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
            <div className="relative w-full max-w-md mx-4 bg-background-primary border border-border-default rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4 border-b border-border-default">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <h2 className="text-text-primary text-xl font-bold">{t('modals.editList.title')}</h2>
                        </div>
                        <p className="text-text-secondary text-sm">{t('modals.editList.subtitle')}</p>
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
                        {/* List Name */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-2">
                                {t('lists.listName')}
                            </label>
                            <input
                                type="text"
                                {...register('title')}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-2">
                                {t('lists.description')}
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        {/* List Color */}
                        <div>
                            <label className="block text-text-primary text-sm font-semibold mb-3">
                                {t('lists.color')}
                            </label>
                            <div className="flex gap-3 flex-wrap">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.value}
                                        type="button"
                                        onClick={() => setValue('color', color.value)}
                                        className={`w-10 h-10 rounded-full ${color.class} transition-transform hover:scale-110 hover:cursor-pointer ${selectedColor === color.value
                                            ? 'ring-4 ring-white/30 scale-110'
                                            : ''
                                            }`}
                                        aria-label={`Select ${color.name}`}
                                    />
                                ))}
                            </div>
                            {errors.color && (
                                <p className="text-red-400 text-xs mt-1">{errors.color.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end p-6 pt-4 border-t border-border-default">
                        <div className="flex items-center gap-3">
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
                    </div>
                </form>
            </div>
        </div>
    );
};
