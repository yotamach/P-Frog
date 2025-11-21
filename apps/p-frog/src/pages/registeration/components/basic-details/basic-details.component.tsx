import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Route, Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface BasicDetailsProps {}

export function BasicDetails(props: BasicDetailsProps) {
  return (
    <Box sx={{ p: 1 }} >
        <Typography variant="h1" component="h2">Login details</Typography>
    </Box>
  );
}

export default BasicDetails;
