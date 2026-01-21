import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeModal } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/api/mutations/tasks.mutations';
import { useCreateList } from '@/api/mutations/lists.mutations';
import { useDeleteUser } from '@/api/mutations/users.mutations';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { CreateTaskFormData, EditTaskFormData } from '@/schemas/task.schemas';
import type { CreateListFormData } from '@/schemas/list.schemas';

export const ModalManager = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isOpen, type, data } = useAppSelector((state) => state.ui.modal);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const createListMutation = useCreateList();
    const deleteUserMutation = useDeleteUser();

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

    const handleDeleteTask = async () => {
        if (!data?.taskId) return;

        try {
            await deleteTaskMutation.mutateAsync(data.taskId);
            handleClose();
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleCreateList = async (formData: CreateListFormData) => {
        try {
            await createListMutation.mutateAsync(formData);
            handleClose();
        } catch (error) {
            console.error('Failed to create list:', error);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUserMutation.mutateAsync();
            // Clear auth state and redirect to auth page
            dispatch(logout());
            handleClose();
            navigate('/auth');
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account. Please try again.');
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
            return (
                <CreateListModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onSubmit={handleCreateList}
                    isLoading={createListMutation.isPending}
                />
            );

        case 'EDIT_LIST':
            return <EditListModal isOpen={isOpen} onClose={handleClose} list={data} />;

        case 'TASK_DETAILS':
            return <TaskDetailsModal onClose={handleClose} task={data} />;

        case 'DELETE_CONFIRMATION':
            return (
                <DeleteConfirmationModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    onConfirm={data?.accountDelete ? handleDeleteAccount : handleDeleteTask}
                    itemName={data?.itemName || 'item'}
                    itemType={data?.itemType || 'item'}
                    isLoading={data?.accountDelete ? deleteUserMutation.isPending : deleteTaskMutation.isPending}
                />
            );

        default:
            return null;
    }
};
