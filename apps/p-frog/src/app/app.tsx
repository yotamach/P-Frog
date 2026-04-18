import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@data/store/queryClient';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { SnackbarProvider } from '@components/notifications/snackbar-context';
import { Home, Login, Registration, Welcome, NotFound } from '@pages/index';
import { ProtectedRoute } from '../components/protected-route/protected-route';
import { lazy, Suspense, useEffect } from 'react';
import { initializeAuth } from '@data/queries/auth.queries';
import { useStore } from '@tanstack/react-store';
import { authStore, selectUser } from '@data/store/authStore';
import { SystemRole } from '@p-frog/data';

const Dashboard = lazy(() => import('@pages/dashboard/dashboard.component'));
const Settings = lazy(() => import('@pages/settings/settings.component'));
const Tasks = lazy(() => import('@pages/tasks/tasks.component'));
const Projects = lazy(() => import('@pages/projects/projects.component'));
const Users = lazy(() => import('@pages/users/users.component'));

const PageLoader = () => (
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

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const user = useStore(authStore, selectUser);
  const role: SystemRole = user?.role ?? SystemRole.MEMBER;
  const allowed = role === SystemRole.ADMIN || role === SystemRole.SUPERUSER;
  return allowed ? children : <Navigate to="/home" replace />;
};

export const App = () => {
  // Initialize auth from localStorage on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Redirect root to welcome */}
              <Route path='/' element={<Navigate to="/welcome" replace />} />
              
              {/* Public routes */}
              <Route path='/welcome' element={<Welcome />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='/login' element={<Login />} />
              
              {/* Protected routes with layout */}
              <Route element={<ProtectedRoute />}>
                <Route path='/home' element={<Home />}>
                  <Route index element={<Dashboard />} />
                  <Route path='tasks/*' element={<Tasks />} />
                  <Route path='projects' element={<Projects />} />
                  <Route path='settings' element={<Settings />} />
                  <Route path='users' element={<RequireAdmin><Users /></RequireAdmin>} />
                  {/* 404 for authenticated users - with layout */}
                  <Route path='*' element={<NotFound />} />
                </Route>
              </Route>

              {/* 404 for unauthenticated users - without layout */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default App;
