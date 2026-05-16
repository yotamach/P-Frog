import { Store } from '@tanstack/react-store';

export interface AuthState {
  isAuth: boolean;
  user: any | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuth: false,
  user: null,
  error: null,
};

export const authStore = new Store<AuthState>(initialState);

export const setAuth = (isAuth: boolean, user?: any) => {
  authStore.setState((state) => ({
    ...state,
    isAuth,
    user: user ?? null,
    error: null,
  }));
};

export const setAuthError = (error: string) => {
  authStore.setState((state) => ({ ...state, error }));
};

export const clearAuth = () => {
  authStore.setState(() => initialState);
};

// Selectors
export const selectIsAuth = (state: AuthState) => state.isAuth;
export const selectUser = (state: AuthState) => state.user;
export const selectAuthError = (state: AuthState) => state.error;
