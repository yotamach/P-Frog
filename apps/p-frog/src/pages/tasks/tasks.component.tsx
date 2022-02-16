import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route, Link } from 'react-router-dom';

import './tasks.component.module.scss';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Tasks(props: TasksProps) {
  return (
    <Box sx={{ p: 1 }}>
        <Typography variant="h1" component="h2">Tasks</Typography>
    </Box>
  );
}

export default Tasks;
