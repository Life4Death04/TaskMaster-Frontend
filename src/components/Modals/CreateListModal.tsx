import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListSchema, type CreateListFormData } from '@/schemas/list.schemas';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateListFormData) => void;
    isLoading?: boolean;
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

export const CreateListModal = ({ isOpen, onClose, onSubmit, isLoading = false }: CreateListModalProps) => {
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CreateListFormData>({
        resolver: zodResolver(createListSchema),
        defaultValues: {
            title: '',
            description: '',
            color: COLORS[0].value,
        },
    });

    const selectedColor = watch('color');

    const handleFormSubmit = handleSubmit((data: CreateListFormData) => {
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
                    <h2 className="text-text-primary text-xl font-bold">{t('modals.createList.title')}</h2>
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
                                placeholder={t('modals.createList.listNamePlaceholder')}
                                {...register('title')}
                                className="w-full px-4 py-2.5 bg-background-input border border-border-input rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-text-secondary text-sm mb-2 flex items-center gap-1">
                                <span className="font-semibold text-text-primary">{t('lists.description')}</span>
                                <span className="text-xs">({t('common.optional')})</span>
                            </label>
                            <textarea
                                placeholder={t('modals.createList.descriptionPlaceholder')}
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
                    <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-border-default">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 bg-background-primary-hover hover:bg-background-primary hover:cursor-pointer text-text-primary rounded-lg font-medium transition-colors border border-border-default"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-gradient-blueToPurple hover:bg-primary-hover hover:cursor-pointer text-white rounded-lg font-medium transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? t('common.saving') : t('lists.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
