import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project } from '@p-frog/data';
import { ProjectsAPI } from '../services/projects.service';
import { useSnackbar } from '@components/notifications/snackbar-context';

const projectsAPI = new ProjectsAPI();

export const PROJECTS_QUERY_KEY = 'projects';

// Fetch all projects
export function useProjects() {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: async () => {
      const response = await projectsAPI.fetchAll();
      return response.data.projects as Project[];
    },
  });
}

// Create project
export function useCreateProject() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (project: Project) => {
      const response = await projectsAPI.create(project);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      enqueueSnackbar('Project created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to create project', { variant: 'error' });
    },
  });
}

// Update project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async ({ id, project }: { id: string; project: Project }) => {
      const response = await projectsAPI.update(id, project);
      return response.data.project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      enqueueSnackbar('Project updated successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to update project', { variant: 'error' });
    },
  });
}

// Delete project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await projectsAPI.delete(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      enqueueSnackbar('Project deleted successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Failed to delete project', { variant: 'error' });
    },
  });
}
