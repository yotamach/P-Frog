import React, { useEffect, useState } from 'react';
import {createTheme, Theme, ThemeProvider} from "@mui/material";
import styles from "./app.module.scss";
import {lighThemeOptions} from "../theme";
import { Header, Main, Footer } from '@components';
import { Message } from '@p-frog/data';
import { Provider } from 'react-redux';
import { store } from '@data';
import { BrowserRouter } from 'react-router-dom';

const theme: Theme = createTheme(lighThemeOptions);

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  return (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <div className={styles.app}>
              <Header/>
              <Main/>
              <Footer />
            </div>
          </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
