import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStore } from 'store';

const MuiThemeProvider = ({ children }) => {
  const { state: { themeMode } } = useStore();

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: themeMode === 'dark' ? {
        main: '#393939' // main color for dark mode
      } : {
        main: '#EDECE4' // main color for light mode
      },
      background: themeMode === 'dark' ? {
        paper: '#1E1E1E',// main color for dark mode
      } : {
        paper: '#ffffff' // main color for light mode
      },
      text: {
        primary: themeMode === 'dark' ? '#EDECE4' : '#000000',
        secondary: themeMode === 'dark' ? '#606163' : '#000000',
      },
      border: {
        primary: themeMode === 'dark' ? '#5D5D5D' : '#000000',
        secondary: themeMode === 'dark' ? '#464749' : '#000000',
      }
    },
  });

  return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
  );
};

export default MuiThemeProvider;