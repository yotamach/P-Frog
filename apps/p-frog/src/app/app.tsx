import React, { useEffect, useState } from 'react';
import {createTheme, Theme, ThemeProvider} from "@mui/material";
import {lighThemeOptions} from "../theme";
import { Header, Main, Footer, SideNav } from '@components/index';
import { Message } from '@p-frog/data';
import { Provider } from 'react-redux';
import { menuItems, store } from '@data/index';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Dashboard, Home, Login, Registration, Welcome } from '@pages/index';

const theme: Theme = createTheme(lighThemeOptions);

export const App = () => {
  const [m, setMessage] = useState<Message>({ message: '' });

  return (
    <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SnackbarProvider
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
          >
            <BrowserRouter>
              <div className="grid grid-cols-[240px_1fr] grid-rows-[50px_1fr_50px] h-screen" style={{gridTemplateAreas: '"header header" "sidenav main" "footer footer"'}}>
                <Routes>
                  <Route path='/' element={<Welcome />}  />
                  <Route path='/home' element={<Home />}  />
                  <Route path='/registration' element={<Registration />}  />
                  <Route path='/login' element={<Login />} />
                </Routes>
              </div>
            </BrowserRouter>
          </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
