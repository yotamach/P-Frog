import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { menuItems } from '@data/constans/MenuItems';

const Main = () => {
   
  const getRoutes = () => menuItems.map(menuItem => (<Route key={menuItem.title} path={menuItem.path} element={menuItem.component} />));
  
  return (
    <div className="h-full w-full">
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
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
          {getRoutes()}
        </Routes>
      </Suspense>
    </div>
  );
};
export default Main;
