import * as React from 'react';
import Box from "@mui/material/Box";
import styles from "./main.module.scss";
import {SideNav} from "../index";
import { Paper } from '@mui/material';

const Main = () => {

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
          Content
        </Box>
      </Box>
    </Paper>
  );
};
export default Main;
