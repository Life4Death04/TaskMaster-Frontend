import { motion, AnimatePresence } from 'framer-motion';
import { modalVariants, backdropVariants } from '@/utils/animations';

interface AnimatedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

/**
 * Animated Modal Wrapper Component
 * Provides consistent fade-in-up animations for all modals
 */
export const AnimatedModal = ({ isOpen, onClose, children, className = '' }: AnimatedModalProps) => {
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    />

                    {/* Modal Content */}
                    <motion.div
                        className={className}
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
