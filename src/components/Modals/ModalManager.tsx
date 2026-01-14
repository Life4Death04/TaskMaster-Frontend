import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeModal } from '@/features/ui/uiSlice';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';

export const ModalManager = () => {
    const dispatch = useAppDispatch();
    const { isOpen, type, data } = useAppSelector((state) => state.ui.modal);

    const handleClose = () => {
        dispatch(closeModal());
    };

    if (!isOpen) return null;

    switch (type) {
        case 'CREATE_TASK':
            return <CreateTaskModal isOpen={isOpen} onClose={handleClose} />;

        case 'EDIT_TASK':
            return <EditTaskModal isOpen={isOpen} onClose={handleClose} task={data} />;

        case 'CREATE_LIST':
            return <CreateListModal isOpen={isOpen} onClose={handleClose} />;

        case 'EDIT_LIST':
            return <EditListModal isOpen={isOpen} onClose={handleClose} list={data} />;

        default:
            return null;
    }
};
