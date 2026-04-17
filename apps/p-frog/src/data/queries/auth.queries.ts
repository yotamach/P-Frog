import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthAPI } from '../services';
import { useSnackbar } from '@components/notifications/snackbar-context';
import { setAuth, setAuthError, clearAuth } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

const authAPI = new AuthAPI();

export const AUTH_QUERY_KEY = 'auth';
interface LoginCredentials {
  userName: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userName: string;
}

// Login mutation
export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
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
        
        // Save to localStorage for persistence
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Store auth state
        setAuth(true, user, token);
        
        // Show success message
        enqueueSnackbar('Login successful!', { variant: 'success' });
        
        // Redirect to the page they were trying to access, or home
        const from = (location.state as any)?.from?.pathname || '/home';
        navigate(from, { replace: true });
      }
    },
    onError: (error: any) => {
      const rawError = error?.response?.data?.data || error?.response?.data?.message || error?.message || 'Login failed';
      const errorMessage = typeof rawError === 'string' ? rawError : 'Login failed';
      setAuthError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

// Sign up mutation
export function useSignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (userData: SignUpData) => {
      const response = await authAPI.signUp(userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        enqueueSnackbar('Registration successful! Please log in.', { variant: 'success' });
        navigate('/login');
      } else {
        const errorMessage = data.message || 'Registration failed';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Registration failed. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

// Sign out/logout mutation
export function useSignOut() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear auth store
      clearAuth();
    },
    onSuccess: () => {
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
      navigate('/login');
    },
  });
}

// Alias for useSignOut to support both naming conventions
export const useLogout = useSignOut;

// Profile query to validate token
export function useProfile(enabled = false) {
  return useQuery({
    queryKey: [AUTH_QUERY_KEY, 'profile'],
    queryFn: async () => {
      try {
        const response = await authAPI.getProfile();
        return response.data;
      } catch (error) {
        // If profile fetch fails, token is invalid - clear auth
        clearAuth();
        throw error;
      }
    },
    enabled,
    retry: false,
    staleTime: Infinity,
  });
}

// Initialize auth from localStorage
export const initializeAuth = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      setAuth(true, user, token);
      return true;
    } catch {
      // Invalid stored data, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      clearAuth();
      return false;
    }
  }
  
  clearAuth();
  return false;
};
