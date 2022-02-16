import { useEffect } from 'react';
import Box from "@mui/material/Box";
import styles from "./main.module.scss";
import {SideNav} from "../index";
import { Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { fetchTasks, tasksActions } from 'src/data/store/tasks/tasks.slice';
import { Route, Routes } from 'react-router-dom';
import { menuItems } from '@data';

const Main = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(tasksActions.add({ id: 1, title: "Yotam", description: "Yotam task", startDate: "2021-11-11", endDate: "2022-11-11" }))
    dispatch(fetchTasks());
  }, [dispatch]);
   
  const getRoutes = () => menuItems.map(menuItem => (<Route key={menuItem.title} path={menuItem.path} element={menuItem.component} />));
  
  return (
    <Paper elevation={2} className={styles.main} >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          height: '100%'
        }}>
        <Box width={'10%'} height={'100%'} bgcolor={'primary.light'}>
            <SideNav />
        </Box>
        <Box flexGrow={1}>
          <Routes>
            {getRoutes()}
          </Routes>
        </Box>
      </Box>
    </Paper>
  );
};
export default Main;
