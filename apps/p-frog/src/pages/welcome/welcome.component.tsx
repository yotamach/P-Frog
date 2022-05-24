import Box from "@mui/material/Box";
import { Route, Link } from 'react-router-dom';

import './welcome.component.module.scss';
import Typography from '@mui/material/Typography';
import { Divider, Paper } from "@mui/material";
import { Fragment } from "react";
import { Footer, Header } from "@components/index";

/* eslint-disable-next-line */
export interface WelcomeProps {}

export function Welcome(props: WelcomeProps) {
  return (
    <Fragment>
      <Header title={'LOGO'} />
      <Box sx={{ p: 1 }}>
          <Typography variant="h5" component="h5">Welcome</Typography>
          <Divider />
          <Paper elevation={3} sx={{ p: 1 }} >
            welcome to P-frog
          </Paper>
      </Box>
      <Footer />
    </Fragment>
  );
}

export default Welcome;
