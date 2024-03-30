import React, {useState} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
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
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import {styled, useTheme} from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Content from 'sections/Content';
import Paper from "@material-ui/core/Paper";
import SideBar from "../SideBar";
import { MuiThemeProvider } from 'theme';

const drawerWidth = 150;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(5)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(6)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);


export default function Header_SideBar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    function handleThemeSwitch(ev) {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }

    const handleSettingsClick = () => {
        setSettingsRotate(!settingsRotate);
        setIsSettingsVisible(!isSettingsVisible);
    };

    const {
        state: { themeMode, editorMode, isSettingsVisible },
        actions: { setThemeMode, setEditorMode, setIsSettingsVisible },
    } = useStore();
    console.log("themeMode", themeMode);
    const [settingsRotate, setSettingsRotate] = useState(false);
    const classes = useStyles();


    console.log(themeMode);
    console.log(theme.palette.mode, theme.palette.background.default, theme.palette.mode === 'dark' ? '#313131' : '#FFFFFF');
    return (
        <MuiThemeProvider>
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'left',
                background: theme.palette.background.paper,
            }}>
                <CssBaseline/>
                <AppBar style={{ background: theme.palette.primary.main }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{
                            marginRight: 15,
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {!isMobile && (
                        <Typography variant="h4" className={classes.title}>
                            BrainPower>AI
                        </Typography>
                    )}
                    <Button onClick={handleThemeSwitch}>

                        <img
                            className={classNames(classes.themeSwitcher, { [classes.rotate]: themeMode === 'dark' })}
                            style={{ filter: themeMode === 'dark' ? 'invert(1)' : 'none' }}

                            width="20"
                            src={config.urls.themeModeIcon}
                            alt="theme mode icon"
                        />
                    </Button>
                    <Button onClick={handleSettingsClick}>
                        <SettingsIcon
                            className={classNames(classes.settingsSwitcher, {[classes.rotate]: settingsRotate})}
                            style={{
                                filter: settingsRotate ? 'none' : 'brightness(0.5)',
                                color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black
                            }}
                        />
                    </Button>


                </Toolbar>
            </AppBar>
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                    '& .MuiDrawer-paper': {
                        bgcolor: theme.palette.mode === 'dark' ? '#2B2D30' : '#FFFFFF',
                    },
                }}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />

                    <SideBar />
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1}}  >
                    <DrawerHeader />
                    <Paper
                        elevation={0}
                        square={true}
                        className={classNames('full-size', classes.root)}
                        sx={{
                           '& .MuiDrawer-paper': {
                               bgcolor: theme.palette.mode === 'dark' ? '#2B2D30' : '#FFFFFF',
                           },
                           backgroundColor: theme.palette.background.paper, // add this line
                        }}>
                        <Content />

                    </Paper>
                </Box>
            </Box>
            <Notifications />
        </>
        </MuiThemeProvider>
    );
};
