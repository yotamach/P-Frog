/**
 * Frontend Component Tests for Login Form
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './login-form.component';
import { useLogin } from '@data/queries/auth.queries';

// Mock the useLogin hook
jest.mock('@data/queries/auth.queries', () => ({
  useLogin: jest.fn(),
}));

describe('LoginForm', () => {
  let queryClient: QueryClient;
  const mockMutate = jest.fn();
  const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
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
    
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    jest.clearAllMocks();
  });

  it('should render login form with all fields', () => {
    // Act
    render(<LoginForm />, { wrapper });

    // Assert
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    // Arrange
    render(<LoginForm />, { wrapper });
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Act
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('should submit form with valid credentials', async () => {
    // Arrange
    render(<LoginForm />, { wrapper });
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });

    // Act
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        userName: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should disable submit button when loading', () => {
    // Arrange
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    // Act
    render(<LoginForm />, { wrapper });
    const submitButton = screen.getByRole('button', { name: /logging in/i });

    // Assert
    expect(submitButton).toBeDisabled();
  });

  it('should show link to registration page', () => {
    // Act
    render(<LoginForm />, { wrapper });

    // Assert
    const signupLink = screen.getByText(/sign up/i);
    expect(signupLink).toBeInTheDocument();
    expect(signupLink.closest('a')).toHaveAttribute('href', '/registration');
  });
});
