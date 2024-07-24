import React, {useState, useEffect} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import classNames from 'classnames';
import Notifications from 'notifications';
import { useStore } from 'store';
import { isMobile } from 'utils';
import config from 'config';
import useStyles from './useStyles';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import {styled, useTheme} from "@mui/material/styles";
import { List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
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
import Settings from 'sections/Settings';
import SignUp from 'sections/SignUp';
import Paper from "@mui/material/Paper";
import SideBar from "../SideBar";
import { MuiThemeProvider} from 'theme';
import { Modal, Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const drawerWidth = 250;


const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(2.5),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    paddingLeft: open ? `calc(${drawerWidth}+5px)` : `calc(${theme.spacing(7)} + 28px)`,
    backgroundColor: theme.palette.background.paper,
    // Prevents vertical scrolling within this main content area
    overflowY: 'hidden', // adjust according to your needs
    position: 'absolute', // ensures the component is positioned relative to its nearest positioned ancestor
    top: '60px', // matches the height of the AppBar; adjust as necessary
    left: 0,
    right: 0,
    bottom: 0,
}));
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
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerSettingsHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open ? openedMixin(theme) : closedMixin(theme)),
        '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
    }),
);

export default function Header_SideBar() {
    const theme = useTheme();
    const classes = useStyles();
    const { state, actions } = useStore();
    const [open, setOpen] = React.useState(false);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
    const [openSignUpModal, setOpenSignUpModal] = useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const isAuthenticated = state.user !== null;
    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    function handleThemeSwitch(ev) {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }

    const handleSettingsClick = () => {
        setSettingsRotate(!settingsRotate);
        setIsSettingsVisible();
        console.log(isSettingsVisible);
    };

    const {
        state: { themeMode, editorMode, isSettingsVisible },
        actions: { setThemeMode, setEditorMode, setIsSettingsVisible },
    } = useStore();

    const [settingsRotate, setSettingsRotate] = useState(false);

    useEffect(() => {
    console.log(isSettingsVisible);
    }, [isSettingsVisible]);

    const handleOpenSettingsModal = () => setOpenSettingsModal(true);
    const handleCloseSettingsModal = () => setOpenSettingsModal(false);

    const handleOpenSignUpModal = () => setOpenSignUpModal(true);
    const handleCloseSignUpModal = () => setOpenSignUpModal(false);

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
                <AppBar style={{ background: theme.palette.primary.main }}>
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
                    <Tooltip title="Change theme">
                        <IconButton
                            onClick={() => actions.setThemeMode(state.themeMode === 'light' ? 'dark' : 'light')}>
                            {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                        <IconButton onClick={handleOpenSettingsModal}>
                            <TuneIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={isAuthenticated ? "Manage Account" : "Login/Sign Up"}>
                        <IconButton
                            onClick={handleOpenSignUpModal}
                            sx={{
                                color: isAuthenticated ? '#90CAF9' : 'inherit',
                                '&:hover': {
                                    backgroundColor: isAuthenticated ? 'rgba(144, 202, 249, 0.08)' : 'rgba(255, 255, 255, 0.08)',
                                },
                            }}
                        >
                            <ManageAccountsIcon />
                        </IconButton>

                    </Tooltip>

                </Toolbar>
            </AppBar>
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                        '& .MuiDrawer-paper': {

                            bgcolor: theme.palette.mode === 'dark' ? '#323232' : '#FFFFFF',
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
                <Modal
                    open={openSettingsModal}
                    onClose={handleCloseSettingsModal}
                    modalType="settings"
                    aria-labelledby="settings-modal-title"
                    aria-describedby="settings-modal-description"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} // Centering the modal
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 500, // Adjust according to your needs
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,  // Padding inside the Box
                            outline: 'none'  // Remove the focus outline
                        }}
                    >
                        <Settings /> {/* Your Settings Component */}
                    </Box>
                </Modal>
                <Modal
                    open={openSignUpModal}
                    onClose={handleCloseSignUpModal}
                    modalType="fileSystem"
                    aria-labelledby="file-system-modal-title"
                    aria-describedby="file-system-modal-description"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            width: 500,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 0,
                            outline: 'none'
                        }}
                    >
                        <SignUp/> {/* Our file system overlay component */}
                    </Box>
                </Modal>
                <Main open={open}>
                    <div
                        elevation={0}
                        square={true}
                        className={classNames('full-size', classes.root)}
                        sx={{
                            '& .MuiDrawer-paper': {
                                bgcolor: theme.palette.mode === 'dark' ? '#2B2D30' : '#FFFFFF',
                            },
                            backgroundColor: theme.palette.background.paper,
                            width: '100%', // set the width to 100% of the parent container
                            maxWidth: 'lg', // set a maximum width based on the screen size
                            mx: 2, // add a consistent margin on both sides
                        }}>
                        <Editor />

                    </div>

                </Main>

            </Box>
            <Notifications />
        </>
        </MuiThemeProvider>
    );
};
