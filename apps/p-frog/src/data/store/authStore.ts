import { Store } from '@tanstack/react-store';

export interface AuthState {
  isAuth: boolean;
  user: any | null;
  token: string | null;
  error: string | null;
}

export const authStore = new Store<AuthState>({
  isAuth: false,
  user: null,
  token: null,
  error: null,
});

// Actions
export const setAuth = (isAuth: boolean, user?: any, token?: string) => {
  authStore.setState((state) => ({
    ...state,
    isAuth,
    user: user || null,
    token: token || null,
    error: null,
  }));
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
};

// Selectors
export const selectIsAuth = (state: AuthState) => state.isAuth;
export const selectUser = (state: AuthState) => state.user;
export const selectAuthError = (state: AuthState) => state.error;
