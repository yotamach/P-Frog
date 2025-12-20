import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@data/store/queryClient';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from '@components/notifications/snackbar-context';
import { Home, Login, Registration, Welcome, NotFound } from '@pages/index';
import { lazy, Suspense } from 'react';
import { Dict } from '@p-frog/data';

const bob: Dict = {};
console.log(bob);

const Dashboard = lazy(() => import('@pages/dashboard/dashboard.component'));
const Settings = lazy(() => import('@pages/settings/settings.component'));
const Tasks = lazy(() => import('@pages/tasks/tasks.component'));

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center">
              <div 
                className="w-16 h-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: 'hsl(var(--border))',
                  borderTopColor: 'hsl(var(--sidebar-active))'
                }}
              />
            </div>
          }>
            <Routes>
                {/* Public routes */}
                <Route path='/welcome' element={<Welcome />} />
                <Route path='/registration' element={<Registration />} />
                <Route path='/login' element={<Login />} />
                
                {/* Authenticated routes with layout */}
                <Route path='/' element={<Home />}>
                  <Route index element={<Dashboard />} />
                  <Route path='tasks/*' element={<Tasks />} />
                  <Route path='settings' element={<Settings />} />
                  <Route path='*' element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SnackbarProvider>
      </QueryClientProvider>
  );
};

export default App;
