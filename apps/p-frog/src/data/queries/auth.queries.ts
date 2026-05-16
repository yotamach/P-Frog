import { useMutation } from '@tanstack/react-query';
import { signIn, signUp, signOut, useSession } from '@lib/auth-client';
import { useSnackbar } from '@components/notifications/snackbar-context';
import { setAuth, setAuthError, clearAuth } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

export const AUTH_QUERY_KEY = 'auth';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn.email({
        email: credentials.email,
        password: credentials.password,
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: (data) => {
      const user = (data as any)?.user ?? null;
      setAuth(true, user);
      enqueueSnackbar('Login successful!', { variant: 'success' });
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Login failed';
      setAuthError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    },
  });
}

export function useSignUp() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (userData: SignUpData) => {
      const result = await signUp.email({
        email: userData.email,
        password: userData.password,
        name: `${userData.firstName} ${userData.lastName}`,
        ...(userData as any),
      });
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      enqueueSnackbar('Registration successful! Please log in.', { variant: 'success' });
      navigate('/login');
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.message || 'Registration failed. Please try again.', { variant: 'error' });
    },
  });
}

export function useSignOut() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      await signOut();
      clearAuth();
    },
    onSuccess: () => {
      enqueueSnackbar('Logged out successfully', { variant: 'success' });
      navigate('/login');
    },
  });
}

export const useLogout = useSignOut;

// Re-export useSession for consumers that previously used useProfile
export { useSession };

// No-op — session is now validated via cookies on every request
export const initializeAuth = () => undefined;
