import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { closeModal } from '@/features/ui/uiSlice';
import { logout } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useCreateTask, useUpdateTask, useDeleteTask } from '@/api/mutations/tasks.mutations';
import { useCreateList, useDeleteList, useUpdateList } from '@/api/mutations/lists.mutations';
import { useDeleteUser } from '@/api/mutations/users.mutations';
import { CreateTaskModal } from './CreateTaskModal';
import { EditTaskModal } from './EditTaskModal';
import { CreateListModal } from './CreateListModal';
import { EditListModal } from './EditListModal';
import { TaskDetailsModal } from './TaskDetailsModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import type { CreateTaskFormData, EditTaskFormData } from '@/schemas/task.schemas';
import type { CreateListFormData, UpdateListFormData } from '@/schemas/list.schemas';

export const ModalManager = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const modal = useAppSelector((state) => state.ui.modal);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const createListMutation = useCreateList();
    const updateListMutation = useUpdateList();
    const deleteListMutation = useDeleteList();
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
        if (modal.type !== 'EDIT_TASK') return;

        try {
            await updateTaskMutation.mutateAsync({
                id: modal.data.id,
                data: formData,
            });
            handleClose();
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async () => {
        if (modal.type !== 'DELETE_CONFIRMATION' || !modal.data.taskId) return;

        try {
            await deleteTaskMutation.mutateAsync(modal.data.taskId);
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

    const handleUpdateList = async (formData: UpdateListFormData) => {
        if (modal.type !== 'EDIT_LIST') return;

        try {
            await updateListMutation.mutateAsync({
                id: modal.data.id,
                data: formData,
            });
            handleClose();
        } catch (error) {
            console.error('Failed to update list:', error);
        }
    };

    const handleDeleteList = async () => {
        if (modal.type !== 'DELETE_CONFIRMATION' || !modal.data.listId) return;

        try {
            await deleteListMutation.mutateAsync(modal.data.listId);
            handleClose();
            // Navigate back to lists page after deletion
            navigate('/lists');
        } catch (error) {
            console.error('Failed to delete list:', error);
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

    if (!modal.isOpen) return null;

    switch (modal.type) {
        case 'CREATE_TASK':
            return (
                <CreateTaskModal
                    isOpen={modal.isOpen}
                    onClose={handleClose}
                    onSubmit={handleCreateTask}
                    isLoading={createTaskMutation.isPending}
                    defaultListId={modal.data?.defaultListId}
                />
            );

        case 'EDIT_TASK':
            return (
                <EditTaskModal
                    isOpen={modal.isOpen}
                    onClose={handleClose}
                    onSubmit={handleEditTask}
                    isLoading={updateTaskMutation.isPending}
                    task={modal.data}
                />
            );

        case 'CREATE_LIST':
            return (
                <CreateListModal
                    isOpen={modal.isOpen}
                    onClose={handleClose}
                    onSubmit={handleCreateList}
                    isLoading={createListMutation.isPending}
                />
            );

        case 'EDIT_LIST':
            return (
                <EditListModal
                    isOpen={modal.isOpen}
                    onClose={handleClose}
                    onSubmit={handleUpdateList}
                    isLoading={updateListMutation.isPending}
                    list={modal.data}
                />
            );

        case 'TASK_DETAILS':
            return <TaskDetailsModal onClose={handleClose} task={modal.data} />;

        case 'DELETE_CONFIRMATION':
            const getConfirmHandler = () => {
                if (modal.data?.accountDelete) return handleDeleteAccount;
                if (modal.data?.listId) return handleDeleteList;
                return handleDeleteTask;
            };

            const getLoadingState = () => {
                if (modal.data?.accountDelete) return deleteUserMutation.isPending;
                if (modal.data?.listId) return deleteListMutation.isPending;
                return deleteTaskMutation.isPending;
            };

            return (
                <DeleteConfirmationModal
                    isOpen={modal.isOpen}
                    onClose={handleClose}
                    onConfirm={getConfirmHandler()}
                    itemName={modal.data?.itemName || 'item'}
                    itemType={modal.data?.itemType || 'item'}
                    isLoading={getLoadingState()}
                />
            );

        default:
            return null;
    }
};
