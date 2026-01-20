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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      token: null,
      error: null,
    }));
  });

  it('should render children when user is authenticated', () => {
    // Arrange
    authStore.setState(() => ({
      isAuth: true,
      user: { userName: 'test' },
      token: 'test-token',
      error: null,
    }));

    // Act
    const { getByText } = render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Assert
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      token: null,
      error: null,
    }));

    // Act
    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Assert
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate.mock.calls[0][0]).toBe('/login');
  });

  it('should preserve location state when redirecting', () => {
    // Arrange
    authStore.setState(() => ({
      isAuth: false,
      user: null,
      token: null,
      error: null,
    }));

    // Act
    render(
      <MemoryRouter initialEntries={['/protected']} initialIndex={0}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Assert - should redirect to login with location state
    expect(mockNavigate).toHaveBeenCalled();
    const [to, state] = mockNavigate.mock.calls[0];
    expect(to).toBe('/login');
    expect(state).toHaveProperty('from');
    expect(state.from.pathname).toBe('/protected');
  });
});
