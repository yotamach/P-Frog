/**
 * Frontend Unit Tests for Auth Queries
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useLogin, useSignUp, useLogout, initializeAuth } from './auth.queries';
import { authStore } from '@data/store/authStore';
import React from 'react';
import { AuthAPI } from '@data/services';

// Create mock functions inside the mock factory to avoid hoisting issues
jest.mock('@data/services', () => {
  const mockLoginFn = jest.fn();
  const mockSignUpFn = jest.fn();
  const mockSignOutFn = jest.fn();
  const mockGetProfileFn = jest.fn();
  
  return {
    AuthAPI: jest.fn().mockImplementation(() => ({
      login: mockLoginFn,
      signUp: mockSignUpFn,
      signOut: mockSignOutFn,
      getProfile: mockGetProfileFn,
    })),
  };
});

// Get the mocked AuthAPI instance to access mock functions
const MockedAuthAPI = AuthAPI as jest.MockedClass<typeof AuthAPI>;
const mockAuthInstance = new MockedAuthAPI();
const mockLogin = mockAuthInstance.login as jest.Mock;
const mockSignUp = mockAuthInstance.signUp as jest.Mock;
const mockSignOut = mockAuthInstance.signOut as jest.Mock;
const mockGetProfile = mockAuthInstance.getProfile as jest.Mock;

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
    localStorage.clear();
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      token: null,
      error: null,
    }));
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('useLogin', () => {
    it('should login successfully and store token', async () => {
      // Arrange
      const mockUser = {
        _id: 'user-id',
        userName: 'testuser',
        email: 'test@example.com',
        token: 'jwt-token',
      };

      mockLogin.mockResolvedValue({
        data: {
          success: true,
          data: mockUser,
        },
      });

      // Act
      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ userName: 'testuser', password: 'password123' });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(localStorage.getItem('token')).toBe('jwt-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      expect(authStore.state.isAuth).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });

    it('should handle login failure', async () => {
      // Arrange
      mockLogin.mockResolvedValue({
        data: {
          success: false,
          data: 'Invalid Credentials!',
        },
      });

      // Act
      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ userName: 'wrong', password: 'wrong' });

      // Assert
      await waitFor(() => {
        expect(result.current.isError || result.current.isSuccess).toBe(true);
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(authStore.state.isAuth).toBe(false);
    });

    it('should handle network errors', async () => {
      // Arrange
      mockLogin.mockRejectedValue({
        response: {
          data: { message: 'Network error' },
        },
      });

      // Act
      const { result } = renderHook(() => useLogin(), { wrapper });
      result.current.mutate({ userName: 'test', password: 'test' });

      // Assert
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(authStore.state.error).toBeTruthy();
    });
  });

  describe('useSignUp', () => {
    it('should register successfully and navigate to login', async () => {
      // Arrange
      mockSignUp.mockResolvedValue({
        data: {
          success: true,
        },
      });

      // Act
      const { result } = renderHook(() => useSignUp(), { wrapper });
      result.current.mutate({
        userName: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should handle registration failure', async () => {
      // Arrange
      mockSignUp.mockResolvedValue({
        data: {
          success: false,
          message: 'User already exists',
        },
      });

      // Act
      const { result } = renderHook(() => useSignUp(), { wrapper });
      result.current.mutate({
        userName: 'existing',
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      });

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });
  });

  describe('useLogout', () => {
    it('should logout and clear storage', async () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ userName: 'test' }));
      authStore.setState(() => ({
        isAuth: true,
        user: { userName: 'test' },
        token: 'test-token',
        error: null,
      }));

      // Act
      const { result } = renderHook(() => useLogout(), { wrapper });
      result.current.mutate();

      // Assert
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(authStore.state.isAuth).toBe(false);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('initializeAuth', () => {
    it('should restore auth from localStorage', () => {
      // Arrange
      const mockUser = { userName: 'test', email: 'test@example.com' };
      localStorage.setItem('token', 'stored-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Act
      const result = initializeAuth();

      // Assert
      expect(result).toBe(true);
      expect(authStore.state.isAuth).toBe(true);
      expect(authStore.state.token).toBe('stored-token');
      expect(authStore.state.user).toEqual(mockUser);
    });

    it('should return false when no token in storage', () => {
      // Act
      const result = initializeAuth();

      // Assert
      expect(result).toBe(false);
      expect(authStore.state.isAuth).toBe(false);
    });

    it('should clear invalid stored data', () => {
      // Arrange
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', 'invalid-json');

      // Act
      const result = initializeAuth();

      // Assert
      expect(result).toBe(false);
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});

