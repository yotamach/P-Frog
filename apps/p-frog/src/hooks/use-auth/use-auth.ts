import { useStore } from '@tanstack/react-store';
import { authStore, setAuth, clearAuth, selectIsAuth, selectUser, selectAuthError } from '@data/store/authStore';

export interface UseAuth {
  isAuth: boolean;
  user: any | null;
  error: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export function useAuth(): UseAuth {
  const isAuth = useStore(authStore, selectIsAuth);
  const user = useStore(authStore, selectUser);
  const error = useStore(authStore, selectAuthError);

  const login = (user: any, token: string) => {
    setAuth(true, user, token);
  };

  const logout = () => {
    clearAuth();
  };

  return {
    isAuth,
    user,
    error,
    login,
    logout,
  };
}

export default useAuth;
