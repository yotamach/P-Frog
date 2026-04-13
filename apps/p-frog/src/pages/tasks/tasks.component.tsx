import { Suspense } from 'react';
import { tasksMenuItems } from '@data/constans/MenuItems';
import { useTask } from '@hooks/index';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Tasks(props: TasksProps) {
  const getRoutes = () => tasksMenuItems.map(tasksMenuItem => (<Route key={tasksMenuItem.title} path={tasksMenuItem.path} element={tasksMenuItem.component} />));
  const { getTasks } = useTask(); 

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="border-b-2 pb-4" style={{ borderColor: 'hsl(var(--border))' }}>
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: 'hsl(var(--sidebar-text))' }}>
          Tasks
        </h1>
        <p className="text-[0.95rem] font-medium" style={{ color: 'hsl(var(--table-text-muted))' }}>
          Manage your tasks and track progress
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center p-16">
          <div 
            className="w-10 h-10 border-4 rounded-full animate-spin" 
            style={{
              borderColor: 'hsl(var(--border))',
              borderTopColor: 'hsl(var(--sidebar-active))'
            }}
          />
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
