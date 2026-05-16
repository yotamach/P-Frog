/**
 * Frontend Unit Tests for Auth Queries
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useLogin, useSignUp, useLogout, initializeAuth } from './auth.queries';
import { authStore } from '@data/store/authStore';
import React from 'react';

const mockSignInEmail = jest.fn();
const mockSignUpEmail = jest.fn();
const mockSignOut = jest.fn();

jest.mock('@lib/auth-client', () => ({
  signIn: { email: (...args: any[]) => mockSignInEmail(...args) },
  signUp: { email: (...args: any[]) => mockSignUpEmail(...args) },
  signOut: (...args: any[]) => mockSignOut(...args),
  useSession: jest.fn().mockReturnValue({ data: null, isPending: false }),
}));

jest.mock('@components/notifications/snackbar-context', () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
}));

describe('Auth Queries', () => {
  let queryClient: QueryClient;

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      error: null,
    }));
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('useLogin', () => {
    it('should login successfully and update auth store', async () => {
      const mockUser = { id: 'user-id', email: 'test@example.com', name: 'Test User' };
      mockSignInEmail.mockResolvedValue({ data: { user: mockUser }, error: null });

      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ email: 'test@example.com', password: 'password123' });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authStore.state.isAuth).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });

    it('should handle login failure', async () => {
      mockSignInEmail.mockResolvedValue({ data: null, error: { message: 'Invalid credentials' } });

      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ email: 'wrong@example.com', password: 'wrong' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(authStore.state.isAuth).toBe(false);
    });

    it('should handle network errors', async () => {
      mockSignInEmail.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ email: 'test@example.com', password: 'test' });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(authStore.state.error).toBeTruthy();
    });
  });

  describe('useSignUp', () => {
    it('should register successfully and navigate to login', async () => {
      mockSignUpEmail.mockResolvedValue({ data: { user: {} }, error: null });

      const { result } = renderHook(() => useSignUp(), { wrapper });
      result.current.mutate({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should handle registration failure', async () => {
      mockSignUpEmail.mockResolvedValue({ data: null, error: { message: 'Email already in use' } });

      const { result } = renderHook(() => useSignUp(), { wrapper });
      result.current.mutate({
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockNavigate).not.toHaveBeenCalledWith('/login');
    });
  });

  describe('useLogout', () => {
    it('should logout and clear auth store', async () => {
      mockSignOut.mockResolvedValue({});
      authStore.setState(() => ({
        isAuth: true,
        user: { email: 'test@example.com' },
        error: null,
      }));

      const { result } = renderHook(() => useLogout(), { wrapper });
      result.current.mutate();

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(authStore.state.isAuth).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('initializeAuth', () => {
    it('should be a no-op that returns undefined', () => {
      const result = initializeAuth();
      expect(result).toBeUndefined();
    });
  });
});
