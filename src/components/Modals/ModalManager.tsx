import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeModal } from '@/features/ui/uiSlice';
import { useCreateTask, useUpdateTask } from '@/api/mutations/tasks.mutations';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { CreateTaskFormData, EditTaskFormData } from '@/schemas/task.schemas';

export const ModalManager = () => {
    const dispatch = useAppDispatch();
    const { isOpen, type, data } = useAppSelector((state) => state.ui.modal);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();

    const handleClose = () => {
        dispatch(closeModal());
    };

    const handleCreateTask = async (formData: CreateTaskFormData) => {
        try {
            await createTaskMutation.mutateAsync(formData);
            handleClose();
        } catch (error) {
            console.error('Failed to create task:', error);
        }
    };

    const handleEditTask = async (formData: EditTaskFormData) => {
        if (!data?.id) return;

        try {
            await updateTaskMutation.mutateAsync({
                id: data.id,
                data: formData,
            });
            handleClose();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    if (!isOpen) return null;

    switch (type) {
        case 'CREATE_TASK':
            return (
                <CreateTaskModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onSubmit={handleCreateTask}
                    isLoading={createTaskMutation.isPending}
                />
            );

        case 'EDIT_TASK':
            return (
                <EditTaskModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onSubmit={handleEditTask}
                    isLoading={updateTaskMutation.isPending}
                    task={data}
                />
            );

        case 'CREATE_LIST':
            return <CreateListModal isOpen={isOpen} onClose={handleClose} />;

        case 'EDIT_LIST':
            return <EditListModal isOpen={isOpen} onClose={handleClose} list={data} />;

        case 'TASK_DETAILS':
            return <TaskDetailsModal onClose={handleClose} task={data} />;

        case 'DELETE_CONFIRMATION':
            return (
                <DeleteConfirmationModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onConfirm={data?.onConfirm || (() => { })}
                    itemName={data?.itemName || 'item'}
                    itemType={data?.itemType || 'item'}
                />
            );

        default:
            return null;
    }
};
