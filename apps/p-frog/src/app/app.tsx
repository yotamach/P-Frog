import { createTheme, Theme, ThemeProvider } from "@mui/material";
import { lighThemeOptions } from "../theme";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@data/store/queryClient';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Home, Login, Registration, Welcome } from '@pages/index';

const theme: Theme = createTheme(lighThemeOptions);

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path='/welcome' element={<Welcome />} />
              <Route path='/registration' element={<Registration />} />
              <Route path='/login' element={<Login />} />
              <Route path='*' element={<Home />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
