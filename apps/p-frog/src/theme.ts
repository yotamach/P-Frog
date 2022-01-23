import {ThemeOptions} from "@mui/material";

export const lighThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#ff0000',
      light: '#9a91ff'
    },
    secondary: {
      main: 'rgba(105,119,255,0.75)',
      light: '#947be5',
    },
    text: {
      primary: '#000000',
      disabled: 'rgba(0,0,0,0.29)',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ffe57f',
    },
  },
};

export const darkThemeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#dad032',
    },
    secondary: {
      main: 'rgba(46,155,203,0.75)',
      light: '#6033f7',
    },
    text: {
      disabled: 'rgba(0,0,0,0.29)',
    },
    error: {
      main: '#e53935',
    },
    warning: {
      main: '#ffe57f',
    },
  },
};
