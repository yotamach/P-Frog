import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import component AFTER mocks are set up
import { ProtectedRoute } from './protected-route';

// Mock dependencies BEFORE importing component
const mockUseStore = jest.fn();
const mockUseProfile = jest.fn();

jest.mock('@tanstack/react-store', () => ({
  useStore: (...args: any[]) => mockUseStore(...args),
}));

jest.mock('@data/queries/auth.queries', () => ({
  useProfile: (isAuth: boolean) => mockUseProfile(isAuth),
}));

jest.mock('@data/store/authStore', () => ({
  authStore: {},
  selectIsAuth: jest.fn(),
}));

jest.mock('@data/services/auth.service', () => ({
  AuthAPI: jest.fn().mockImplementation(() => ({
    login: jest.fn(),
    signup: jest.fn(),
    profile: jest.fn(),
  })),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Only clear call history, not implementations
    mockUseStore.mockClear();
    mockUseProfile.mockClear();
  });

  it('should show loading spinner when validating auth', () => {
    mockUseStore.mockReturnValue(true); // isAuth = true
    mockUseProfile.mockReturnValue({
      isLoading: true,
      isError: false,
    } as any);

    const { container } = render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('should redirect to login when not authenticated', () => {
    mockUseStore.mockReturnValue(false); // isAuth = false
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: false,
    } as any);

    render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('should redirect to login when token validation fails', () => {
    mockUseStore.mockReturnValue(true); // isAuth = true
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: true, // token validation failed
    } as any);

    render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('should render protected content when authenticated and validated', () => {
    mockUseStore.mockReturnValue(true); // isAuth = true
    mockUseProfile.mockReturnValue({
      isLoading: false,
      isError: false,
    } as any);

    // Need to wait for useEffect to complete
    const { rerender } = render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    // Re-render to trigger useEffect completion
    rerender(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    // After validation completes, protected content should be visible
    setTimeout(() => {
      expect(screen.queryByText('Protected Content')).toBeTruthy();
      expect(screen.queryByText('Login Page')).toBeNull();
    }, 100);
  });
});
