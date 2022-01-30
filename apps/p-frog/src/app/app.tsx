import React, { useEffect, useState } from 'react';
import {createTheme, Theme, ThemeProvider} from "@mui/material";
import styles from "./app.module.scss";
import {lighThemeOptions} from "../theme";
import { Header, Main, Footer } from '@components';
import { Message } from '@p-frog/data';

const theme: Theme = createTheme(lighThemeOptions);

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  useEffect(() => {
    fetch('/api')
      .then((r) => r.json())
      .then(setMessage);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <Header/>
        <Main/>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
