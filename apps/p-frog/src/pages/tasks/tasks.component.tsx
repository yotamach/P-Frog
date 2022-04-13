import { SideNav } from '@components/index';
import { tasksMenuItems } from '@data/index';
import { useTask } from '@hooks/index';
import { Divider, Paper } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route, Routes } from 'react-router';
import './tasks.component.module.scss';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Tasks(props: TasksProps) {
  const { tasks, getTasks } = useTask();
  const getRoutes = () => tasksMenuItems.map(tasksMenuItem => (<Route key={tasksMenuItem.title} path={tasksMenuItem.path} element={tasksMenuItem.component} />));

  return (
    <Box sx={{
      p: 1,
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      height: '100%'
    }}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" component="h5">Tasks</Typography>
      </Box>
      <Divider />
      <Box sx={{ width: '10%' }}>
        <SideNav menuItems={tasksMenuItems} color={'text.primary'} />
      </Box>
      <Box flexGrow={1} sx={{ height: '100%' }}>
        <Paper elevation={3} sx={{ p: 1, height: '100%' }} >
          <Routes>
            {getRoutes()}
          </Routes>
        </Paper>
      </Box>        
    </Box>
  );
}

export default Tasks;
