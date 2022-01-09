import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

const SideNav = () => {

  return (
    <Box flexDirection={'column'} color={'primary'} >
     <AppBar title={'P-Frog'} />
      <MenuItem>Home</MenuItem>
      <MenuItem>Events</MenuItem>
      <MenuItem>Settings</MenuItem>
    </Box>
  );
};
export default SideNav;
