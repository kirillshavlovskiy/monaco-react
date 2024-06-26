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
import Paper from "@mui/material/Paper";
import SideBar from "../SideBar";
import { MuiThemeProvider} from 'theme';
import { Modal, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const drawerWidth = 200;


const MainPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    height: '94vh',
    width: '92.5vw',
    marginRight: -5,  // add right margin
}));

const Main = styled('main', {
    shouldForwardProp: (prop) => prop !== 'open',
})(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `20px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),

        }),
        paddingLeft: open ? `${drawerWidth}px` : 0,
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
    const classes = useStyles();
    const { state, actions } = useStore();
    const [open, setOpen] = React.useState(false);
    const [openSettingsModal, setOpenSettingsModal] = useState(false);
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
                            <SettingsIcon />
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
