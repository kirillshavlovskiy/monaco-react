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
        main: '#ffffff' // main color for light mode
      },
      background: themeMode === 'dark' ? {
        paper: '#1E1E1E ' // main color for dark mode
      } : {
        paper: '#ffffff' // main color for light mode
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
      },
    },
    overrides: {
      MuiTextField: {
        root: {
          color: themeMode === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: themeMode === 'dark' ? '#1E1E23' : '#ffffff'
          // other styles you want to set for the TextField root
        }
      },
      MuiInput: {
        root: {
          color: themeMode === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: themeMode === 'dark' ? '#1E1E23' : '#ffffff'
          // other styles you want to set for the input
        }
      },
      MuiFormLabel: {
        root: {
          color: themeMode === 'dark' ? '#ffffff' : '#000000',
          backgroundColor: themeMode === 'dark' ? '#1E1E23' : '#ffffff'
          // other styles you want to set for the label
        }
      },
      // similar for MuiSelect and others if required
    }
  });

  return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
  );
};

export default MuiThemeProvider;