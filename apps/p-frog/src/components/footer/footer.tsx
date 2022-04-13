import * as React from 'react';
import styles from "./footer.module.scss";
import Box from "@mui/material/Box";
import { Typography } from '@mui/material';

const Footer = () => {

  return (
    <Box boxShadow={2} flex='1' alignItems={"center"} className={styles.footer} bgcolor={'primary.main'}>
          <Typography
            variant="body1"
            noWrap
            component="div"
            color="text.secondary"
            sx={{ flexGrow: 1 }}
          >
            Yotam Achrak
          </Typography>   
        </Box>
  );
};
export default Footer;
