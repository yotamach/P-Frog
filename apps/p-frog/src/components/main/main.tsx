import { useEffect } from 'react';
import Box from "@mui/material/Box";
import {SideNav} from "../index";
import { Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchTasks, tasksActions } from '@data/store/tasks/tasks.slice';
import { Route, Routes } from 'react-router-dom';
import { menuItems } from '@data/index';

const Main = () => {
   
  const getRoutes = () => menuItems.map(menuItem => (<Route key={menuItem.title} path={menuItem.path} element={menuItem.component} />));
  
  return (
    <Paper elevation={2} sx={{ gridArea: 'main' }} >
        <Routes>
          {getRoutes()}
        </Routes>
    </Paper>
  );
};
export default Main;
