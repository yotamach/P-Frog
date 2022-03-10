import Box from "@mui/material/Box";
import { Route, Link } from 'react-router-dom';

import './dashboard.component.module.scss';
import Typography from '@mui/material/Typography';
import { Divider, Paper } from "@mui/material";

/* eslint-disable-next-line */
export interface TasksProps {}

export function Dashboard(props: TasksProps) {
  return (
    <Box sx={{ p: 1 }}>
        <Typography variant="h5" component="h5">Dashboard</Typography>
        <Divider />
        <Paper elevation={3} sx={{ p: 1 }} >
          Tasks List
        </Paper>
    </Box>
  );
}

export default Dashboard;
