import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import styles from "./footer.module.scss";

const Footer = () => {

  return (
    <AppBar className={styles.footer}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
  hi
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Footer;
