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
    <div className="flex h-full gap-6">
      {/* Tasks Sidebar */}
      <div className="w-64 border-r border-border bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        </div>
        <SideNav menuItems={tasksMenuItems} color="gray-700" />
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-auto">
        <div className="card p-6">
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
      </div>
    </div>
  );
}

export default Tasks;
