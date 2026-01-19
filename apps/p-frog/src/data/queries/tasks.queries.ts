import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Task } from '@p-frog/data';
import { TasksAPI } from '../services';
import { useSnackbar } from '@components/notifications/snackbar-context';

const tasksAPI = new TasksAPI();

export const TASKS_QUERY_KEY = 'tasks';

// Fetch all tasks
export function useTasks() {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY],
    queryFn: async () => {
      const response = await tasksAPI.fetchAll();
      return response.data.tasks as Task[];
    },
  });
}

// Create task
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (task: Task) => {
      const response = await tasksAPI.create(task);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      enqueueSnackbar('Task added successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to create task', { variant: 'error' });
    },
  });
}

// Update task
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, task }: { id: string; task: Task }) => {
      const response = await tasksAPI.update(id, task);
      return response.data.task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      enqueueSnackbar('Task updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to update task', { variant: 'error' });
    },
  });
}

// Delete task
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await tasksAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
      enqueueSnackbar('Task removed successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to delete task', { variant: 'error' });
    },
  });
}
