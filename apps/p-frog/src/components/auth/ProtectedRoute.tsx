import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '@tanstack/react-store';
import { authStore, selectIsAuth } from '@data/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useStore(authStore, selectIsAuth);
  const location = useLocation();

  if (!isAuth) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
