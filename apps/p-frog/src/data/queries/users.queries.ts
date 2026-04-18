import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { User, SystemRole } from '@p-frog/data';
import { UsersAPI } from '../services/users.service';
import { useSnackbar } from '@components/notifications/snackbar-context';

const usersAPI = new UsersAPI();

export const USERS_QUERY_KEY = 'users';

export function useUsers() {
  return useQuery({
    queryKey: [USERS_QUERY_KEY],
    queryFn: async () => {
      const response = await usersAPI.fetchAll();
      return response.data.users as User[];
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: SystemRole }) => {
      const response = await usersAPI.updateRole(id, role);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      enqueueSnackbar('User role updated successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.error || 'Failed to update role', { variant: 'error' });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await usersAPI.deleteUser(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      enqueueSnackbar('User deleted successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.error || 'Failed to delete user', { variant: 'error' });
    },
  });
}
