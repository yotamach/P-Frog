import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '@tanstack/react-store';
import { authStore, selectIsAuth } from '@data/store/authStore';
import { useSession } from '@lib/auth-client';

export const ProtectedRoute: React.FC = () => {
  const isAuth = useStore(authStore, selectIsAuth);
  const location = useLocation();
  const { isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin"
          style={{
            borderColor: 'hsl(var(--border))',
            borderTopColor: 'hsl(var(--sidebar-active))'
          }}
        />
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
