import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const getTheme = themeMode => {

  const palette = {
    type: themeMode,
  };

  if (themeMode === 'dark') {
    palette.background = {
      paper: '#202124',
    };
    palette.background = {
      paper: '#1E1E23',
    }
  }

  return createMuiTheme({ palette });
};

export default getTheme;
