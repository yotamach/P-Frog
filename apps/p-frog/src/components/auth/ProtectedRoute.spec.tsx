/**
 * Frontend Unit Tests for ProtectedRoute Component
 */

import { render } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { authStore } from '@data/store/authStore';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: (props: { to: string; state?: any; replace?: boolean }) => {
    mockNavigate(props.to, props.state);
    return <div>Redirecting to {props.to}</div>;
  },
}));

jest.mock('@lib/auth-client', () => ({
  useSession: jest.fn().mockReturnValue({ isPending: false }),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      error: null,
    }));
  });

  it('should render Outlet when user is authenticated', () => {
    authStore.setState(() => ({
      isAuth: true,
      user: { email: 'test@example.com' },
      error: null,
    }));

    const { getByText } = render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      error: null,
    }));

    render(
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate.mock.calls[0][0]).toBe('/login');
  });

  it('should preserve location state when redirecting', () => {
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      error: null,
    }));

    render(
      <MemoryRouter initialEntries={['/protected']} initialIndex={0}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalled();
    const [to, state] = mockNavigate.mock.calls[0];
    expect(to).toBe('/login');
    expect(state).toHaveProperty('from');
    expect(state.from.pathname).toBe('/protected');
  });
});
