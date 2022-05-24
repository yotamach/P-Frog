import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route, Link } from 'react-router-dom';
import BasicDetails from './components/basic-details/basic-details';
import './registration.component.module.scss';
import MoreDetails from './components/more-details/nore-details.component';

/* eslint-disable-next-line */
export interface TasksProps {}

export function Registration(props: TasksProps) {
  return (
    <Box sx={{ p: 1 }}>
        <Typography variant="h1" component="h2">Registration</Typography>
        <form>
          <BasicDetails />
          <MoreDetails />
        </form>
    </Box>
  );
}

export default Registration;
