import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useStore } from 'store';

const MuiThemeProvider = ({ children }) => {
  const { state: { themeMode } } = useStore();

  const theme = createTheme({
  components: {
      MuiTab: {
          styleOverrides: {
              root: {
                  textTransform: "none",
                  font: "inherit",
                  fontSize: "h5.fontSize",
                  minHeight: "auto",
                  letterSpacing: "-0.5px",  // Adjust this value to your liking
                  "&:hover": {
                      color: "primary",
                      opacity: 1,
                  },
                  "&$selected": {
                      color: "primary",
                      fontWeight: "theme.typography.fontWeightMedium",
                  },
                  "&:focus": {},
              },
          },
      },
  },
  palette: {
      mode: themeMode,
      primary: themeMode === 'dark' ? {
        main: '#3C3C3C' // main color for dark mode
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