import { Store } from '@tanstack/react-store';

export interface AuthState {
  isAuth: boolean;
  user: any | null;
  token: string | null;
  error: string | null;
}

// Try to load initial state from localStorage
const loadInitialState = (): AuthState => {
  try {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (savedToken && savedUser) {
      return {
        isAuth: true,
        user: JSON.parse(savedUser),
        token: savedToken,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
  }
  
  return {
    isAuth: false,
    user: null,
    token: null,
    error: null,
  };
};

export const authStore = new Store<AuthState>(loadInitialState());

// Actions
export const setAuth = (isAuth: boolean, user?: any, token?: string) => {
  authStore.setState((state) => ({
    ...state,
    isAuth,
    user: user || null,
    token: token || null,
    error: null,
  }));
  
  // Persist to localStorage
  if (isAuth && token && user) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

export const setAuthError = (error: string) => {
  authStore.setState((state) => ({
    ...state,
    error,
  }));
};

export const clearAuth = () => {
  authStore.setState(() => ({
    isAuth: false,
    user: null,
    token: null,
    error: null,
  }));
  
  // Clear from localStorage
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
};

// Selectors
export const selectIsAuth = (state: AuthState) => state.isAuth;
export const selectUser = (state: AuthState) => state.user;
export const selectAuthError = (state: AuthState) => state.error;
