import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route, Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface MoreDetailsProps {}

export function MoreDetails(props: MoreDetailsProps) {
  return (
    <Box sx={{ p: 1 }}>
        <Typography variant="h1" component="h2">Settings</Typography>
    </Box>
  );
}

export default MoreDetails;
