import { Suspense } from 'react';
import { CircularProgress } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { menuItems } from '@data/constans/MenuItems';

const Main = () => {
   
  const getRoutes = () => menuItems.map(menuItem => (<Route key={menuItem.title} path={menuItem.path} element={menuItem.component} />));
  
  return (
    <div className="h-full">
      <Suspense fallback={
        <div className="flex h-full items-center justify-center">
          <CircularProgress />
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
