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
import SettingsIcon from '@material-ui/icons/Settings';

const Header = _ => {
    const {
        state: { themeMode, editorMode, isSettingsVisible },
        actions: { setThemeMode, setEditorMode, setIsSettingsVisible },
    } = useStore();

    const [settingsRotate, setSettingsRotate] = useState(false);
    const classes = useStyles();

    function handleThemeSwitch(ev) {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }

    const handleSettingsClick = () => {
        setSettingsRotate(!settingsRotate);
        setIsSettingsVisible(!isSettingsVisible);
    };

    return (
        <>
            <AppBar color="default">
                <Toolbar>

                    {!isMobile && (
                        <Typography variant="h4" className={classes.title}>
                            BrainPower>AI
                        </Typography>
                    )}
                    <Button onClick={handleThemeSwitch}>

                        <img
                            className={classNames(classes.themeSwitcher, { [classes.rotate]: themeMode === 'dark' })}
                            style={{ filter: settingsRotate ? 'brightness(0.5)' : 'none' }}
                            width="25"
                            src={config.urls.themeModeIcon}
                            alt="theme mode icon"
                        />
                    </Button>
                    <Button onClick={handleSettingsClick}>
                        <SettingsIcon className={classNames(classes.settingsSwitcher, {[classes.rotate]: settingsRotate})} style={{ filter: settingsRotate ? 'brightness(0.5)' : 'none' }} />
                    </Button>
                </Toolbar>
            </AppBar>
            <Notifications />
        </>
    );
};

export default Header;