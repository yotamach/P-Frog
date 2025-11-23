import { Suspense } from 'react';
import { SideNav } from '@components/index';
import { tasksMenuItems } from '@data/constans/MenuItems';
import { useTask } from '@hooks/index';
import { CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Tasks(props: TasksProps) {
  const getRoutes = () => tasksMenuItems.map(tasksMenuItem => (<Route key={tasksMenuItem.title} path={tasksMenuItem.path} element={tasksMenuItem.component} />));
  const { getTasks } = useTask(); 

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <p className="mt-2 text-sm text-gray-600">Manage your tasks and track progress</p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center p-8">
          <CircularProgress />
        </div>
      }>
        <Routes>
          {getRoutes()}
        </Routes>
      </Suspense>
    </div>
  );
}

export default Tasks;
