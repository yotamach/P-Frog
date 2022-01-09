import * as React from 'react';
import Box from "@mui/material/Box";
import SideNav from "../side-nav/side-nav";

const Main = () => {

  return (
    <Box sx={{ display: 'flex', p: 1, bgcolor: 'background.paper' }}>
      <Box width={'10%'}><SideNav /></Box>
      <Box width={'90%'}>Contenet</Box>
    </Box>
  );
};
export default Main;
