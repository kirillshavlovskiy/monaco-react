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
import Editor from 'sections/Editor';
import Paper from "@material-ui/core/Paper";
import SideBar from "../SideBar";
import { MuiThemeProvider, MyPaper } from 'theme';

const drawerWidth = 200;

const MainPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    button: {
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
    },
    fields: {
        color: theme.palette.text.primary,
        border: `2px solid ${theme.palette.text.primary}`,
    },
    height: '94vh',
    width: '92vw',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `0px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);
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
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
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

    const [settingsRotate, setSettingsRotate] = useState(false);
    const classes = useStyles();

   return (
        <MuiThemeProvider>
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'left',
                justifyContent: 'center',
                background: theme.palette.background.paper,
            }}>
                <CssBaseline/>
                <AppBar style={{ background: theme.palette.primary.main, border: "1px solid #464646" }}>
                <Toolbar >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        edge="start"

                    >
                        <MenuIcon />
                    </IconButton>

                    {!isMobile && (
                        <Typography variant="h5" className={classes.title}>
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

                            bgcolor: theme.palette.mode === 'dark' ? '#282828' : '#FFFFFF',
                            color: theme.palette.text.primary,
                            border: "1px solid #464646"
                    },
                }}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerToggle}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />

                    <SideBar />
                </Drawer>
                <Main open={open}>


                    <MainPaper
                        elevation={0}
                        square={true}
                        className={classNames('full-size', classes.root)}
                        sx={{
                           '& .MuiDrawer-paper': {
                               bgcolor: theme.palette.mode === 'dark' ? '#2B2D30' : '#FFFFFF',
                           },
                           backgroundColor: theme.palette.background.paper,
                            marginRight: 0,

                        }}>
                        <Editor />

                    </MainPaper>
                </Main>
            </Box>
            <Notifications />
        </>
        </MuiThemeProvider>
    );
};
