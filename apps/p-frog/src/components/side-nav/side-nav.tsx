import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import styles from "./main.scss";
import Box from "@mui/material/Box";

const Main = () => {

  return (
    <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.paper' }}>
      <Box width={'10%'}>Menu</Box>
      <Box width={'90%'}>Contenet</Box>
    </Box>
  );
};
export default Main;
