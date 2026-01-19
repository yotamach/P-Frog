import { useStore } from '@tanstack/react-store';
import { Navigate, Outlet } from 'react-router-dom';
import { authStore, selectIsAuth } from '@data/store/authStore';
import { useProfile } from '@data/queries/auth.queries';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
  const isAuth = useStore(authStore, selectIsAuth);
  const [isValidating, setIsValidating] = useState(isAuth);
  
  // Validate token if user appears to be authenticated (from localStorage)
  const { isLoading, isError } = useProfile(isAuth);

  useEffect(() => {
    if (isAuth && !isLoading) {
      setIsValidating(false);
    }
  }, [isAuth, isLoading]);

  // Show loading while validating token on initial load
  if (isAuth && isValidating) {
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

  // If not authenticated or token validation failed, redirect to login
  if (!isAuth || isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
