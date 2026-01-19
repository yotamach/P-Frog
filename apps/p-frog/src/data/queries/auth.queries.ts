import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthAPI } from '../services';
import { useSnackbar } from '@components/notifications/snackbar-context';
import { setAuth, setAuthError, clearAuth } from '../store/authStore';

const authAPI = new AuthAPI();

export const AUTH_QUERY_KEY = 'auth';

interface LoginCredentials {
  userName: string;
  password: string;
}

interface SignUpData {
  userName: string;
  password: string;
  name?: string;
}

// Login mutation
export function useLogin() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authAPI.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns { success: true, data: user } where user has token property
      if (data.success && data.data) {
        const user = data.data;
        const token = user.token;
        
        // Store auth state
        setAuth(true, user, token);
        
        // Show success message
        enqueueSnackbar('Login successful!', { variant: 'success' });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.data || error?.response?.data?.message || error?.message || 'Login failed';
      setAuthError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

// Sign up mutation
export function useSignUp() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (userData: SignUpData) => {
      const response = await authAPI.signUp(userData);
      return response.data;
    },
    onSuccess: (data) => {
      // Store auth state
      setAuth(true, data.user, data.token);
      
      // Show success message
      enqueueSnackbar('Account created successfully!', { variant: 'success' });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Sign up failed';
      setAuthError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

// Sign out mutation
export function useSignOut() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await authAPI.signOut(userId);
      return response.data;
    },
    onSuccess: () => {
      // Clear auth state
      setAuth(false);
      
      // Show success message
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Logout failed';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

// Profile query to validate token
export function useProfile(enabled = false) {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY, 'profile'],
    queryFn: async () => {
      const response = await authAPI.getProfile();
      return response.data;
    },
    enabled,
    retry: false,
    staleTime: Infinity,
    onError: () => {
      // If profile fetch fails, token is invalid - clear auth
      clearAuth();
    },
  });
}
