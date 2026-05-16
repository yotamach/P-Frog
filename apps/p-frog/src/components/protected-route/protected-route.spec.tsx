import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';

const mockUseStore = jest.fn();
const mockUseSession = jest.fn();

jest.mock('@tanstack/react-store', () => ({
  useStore: (...args: any[]) => mockUseStore(...args),
}));

jest.mock('@lib/auth-client', () => ({
  useSession: () => mockUseSession(),
}));

jest.mock('@data/store/authStore', () => ({
  authStore: {},
  selectIsAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseStore.mockClear();
    mockUseSession.mockClear();
  });

  it('should show loading spinner while session is pending', () => {
    mockUseStore.mockReturnValue(false);
    mockUseSession.mockReturnValue({ isPending: true });

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('should redirect to login when not authenticated', () => {
    mockUseStore.mockReturnValue(false);
    mockUseSession.mockReturnValue({ isPending: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('should render protected content when authenticated', () => {
    mockUseStore.mockReturnValue(true);
    mockUseSession.mockReturnValue({ isPending: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeTruthy();
    expect(screen.queryByText('Login Page')).toBeNull();
  });
});
