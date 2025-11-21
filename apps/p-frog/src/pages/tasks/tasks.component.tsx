import { SideNav } from '@components/index';
import { tasksMenuItems } from '@data/index';
import { useTask } from '@hooks/index';
import { Divider, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Tasks(props: TasksProps) {
  const getRoutes = () => tasksMenuItems.map(tasksMenuItem => (<Route key={tasksMenuItem.title} path={tasksMenuItem.path} element={tasksMenuItem.component} />));
  const { getTasks, tasks, tasksList } = useTask(); 
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getTasks();
  }, []);

  const { loadingStatus, statusMessage } = tasks;
  useEffect(() => {
      if(statusMessage && (loadingStatus === 'loaded' || loadingStatus || 'error'))
      {
        const { message, type: variant } = statusMessage;
        enqueueSnackbar(message, { variant });
      }
  },[loadingStatus]);

  return (
    <Box sx={{
      p: 1,
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
    }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" component="h5">Tasks</Typography>
      </Box>
      <Divider />
      <Box sx={{ width: '200px' }} pt={2}>
        <SideNav menuItems={tasksMenuItems} color={'text.primary'} bgcolor="background.default" />
      </Box>
      <Box height="89vh" flexGrow={1} sx={{ overflowY: 'scroll' }}>
        <Paper elevation={3} sx={{ p: 1 }} >
          <Routes>
            {getRoutes()}
          </Routes>
        </Paper>
      </Box>        
    </Box>
  );
}

export default Tasks;
