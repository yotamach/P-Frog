import Box from "@mui/material/Box";
import { Route, Link } from 'react-router-dom';

import './dashboard.component.module.scss';
import Typography from '@mui/material/Typography';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Dashboard(props: TasksProps) {
  return (
    <Box sx={{ p: 1 }}>
        <Typography variant="h1" component="h2">Dashboard</Typography>
    </Box>
  );
}

export default Dashboard;
