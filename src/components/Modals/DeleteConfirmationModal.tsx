interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType?: 'task' | 'list' | 'item';
    isLoading?: boolean;
}

/**
 * Delete Confirmation Modal Component
 * Generic confirmation dialog for delete actions
 */
export const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType = 'item',
    isLoading = false,
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-gradient-to-br from-card-primary to-card-primary/95 border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-primary transition-colors z-10"
                    aria-label="Close modal"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Modal Body */}
                <div className="p-8 text-center">
                    {/* Delete Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text-primary mb-3">
                        Delete this {itemType}?
                    </h2>

                    {/* Description */}
                    <p className="text-text-secondary text-sm leading-relaxed mb-8">
                        You are about to permanently delete{' '}
                        <span className="text-text-primary font-semibold">"{itemName}"</span>.
                        This action cannot be undone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Cancel Button */}
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-background-primary-hover hover:bg-background-secondary border border-border-default text-text-primary rounded-lg font-medium transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors hover:cursor-pointer shadow-lg shadow-red-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
