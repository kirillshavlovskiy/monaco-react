import React, {useState} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Notifications from 'notifications';
import { useStore } from 'store';
import { isMobile } from 'utils';
import config from 'config';
import useStyles from './useStyles';


const Header = _ => {
  const {
    state: { themeMode, editorMode, isSettingsVisible },
    actions: { setThemeMode, setEditorMode, setIsSettingsVisible },
  } = useStore();
  const [rotate, setRotate] = useState(false);
  const classes = useStyles();

  const handleThemeSwitch = (ev) => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const toggleSettings = (ev) => {
    console.log("Toggle settings clicked:");
    setIsSettingsVisible(!isSettingsVisible);
    console.log(isSettingsVisible);
    setRotate(!rotate); // toggle rotation state
  };

  return (
    <>
      <AppBar color="default">
        <Toolbar>
          <Typography className={classes.logo}>
            {"<BP />"}
          </Typography>
          {!isMobile && (
            <Typography variant="h6" className={classes.title}>
              BrainPower.AI
            </Typography>
          )}
          <Button onClick={handleThemeSwitch}>
            <span className={classNames(classes.stars, { [classes.activate]: themeMode === 'dark' })} />
            <span className={classNames(classes.stars, { [classes.activate]: themeMode === 'dark' })} />
            <img
              className={classNames(
                  classes.themeSwitcher,
                  {[classes.rotate]: themeMode === 'dark'}
                )}
              width="40"
              src={config.urls.themeModeIcon}
              alt="Theme mode icon"
            />
            </Button>
            <Button onClick={toggleSettings}>

                Settings

          </Button>
        </Toolbar>
      </AppBar>
      <Notifications />
    </>
  );
};

export default Header;