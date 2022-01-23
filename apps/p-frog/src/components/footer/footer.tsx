import * as React from 'react';
import styles from "./footer.module.scss";
import Box from "@mui/material/Box";

const Footer = () => {

  return (
    <Box boxShadow={2} className={styles.footer} bgcolor={'primary.main'}>Footer</Box>
  );
};
export default Footer;
