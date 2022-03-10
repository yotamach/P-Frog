import {ThemeOptions} from "@mui/material";

export const lighThemeOptions: ThemeOptions = {
  palette: {
    primary: {

      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    text: {
      primary: '#000000',
      disabled: 'rgba(0,0,0,0.29)',
      secondary: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    text: {
      disabled: 'rgba(0,0,0,0.29)',
      secondary: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
  },
};
