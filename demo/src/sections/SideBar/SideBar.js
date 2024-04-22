import './styles.css'; // Import the CSS file
import React from 'react';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import CableRoundedIcon from '@mui/icons-material/CableRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useTheme, makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

import Typography from "@mui/material/Typography";

// Define your custom styles here
const useStyles = makeStyles((theme) => ({
    tooltip: {
        fontSize: '2rem',
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,

        // Ensure the styles are applied correctly:
        '& .MuiTooltip-tooltip': {
            fontSize: 'inherit',
            backgroundColor: theme.palette.background.paper,
            color: 'inherit',
            border: 'inherit',
        },
    },
}));

const SideBar = () => {
    const classes = useStyles();
    const theme = useTheme();



    return (
        <List className={classes.root}>
            <Tooltip
                title={<Typography variant="h6" style={{padding: 4, fontSize: 16}}>Learn</Typography>}
                placement="right"
                classes={{ tooltip: classes.tooltip }}
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -10],
                                },
                            },
                        ],
                    },
                }}
            >
                <ListItemButton key="study">
                    <ListItemIcon className={classes.icon}>
                        <span className="material-symbols-rounded">school</span>
                    </ListItemIcon>
                    <ListItemText primary="Learn"/>
                </ListItemButton>
            </Tooltip>
            <Tooltip
                title={<Typography variant="h6" style={{padding: 4, fontSize: 16}}>Playground</Typography>}
                placement="right"
                classes={{ tooltip: classes.tooltip }}
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -10],
                                },
                            },
                        ],
                    },
                }}
            >
                <ListItemButton key="terminal">
                    <ListItemIcon className={classes.icon}>
                        <span className="material-symbols-rounded">
                        stadia_controller
                        </span>

                    </ListItemIcon>
                    <ListItemText>Playground</ListItemText>
                </ListItemButton>
            </Tooltip>

            <Tooltip
                title={<Typography variant="h6" style={{padding: 4, fontSize: 16}}>Project</Typography>}
                placement="right"
                classes={{ tooltip: classes.tooltip }}
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -10],
                                },
                            },
                        ],
                    },
                }}
            >
                <ListItemButton key="project_tree">
                    <ListItemIcon className={classes.icon}>
                        <span className="material-symbols-rounded" style={{color: theme.palette.text.primary}}>
                        view_in_ar
                        </span>
                    </ListItemIcon>
                    <ListItemText>Your Projects</ListItemText>
                </ListItemButton>
            </Tooltip>

            <Tooltip
                title={<Typography variant="h6" style={{padding: 4, fontSize: 16}}>Repository</Typography>}
                placement="right"
                classes={{ tooltip: classes.tooltip }}
                slotProps={{
                    popper: {
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, -10],
                                },
                            },
                        ],
                    },
                }}
            >
                <ListItemButton key="repository">
                    <ListItemIcon className={classes.icon}>
                        <span className="material-symbols-rounded" style={{color: theme.palette.text.primary }}>
                        share
                        </span>
                    </ListItemIcon>
                    <ListItemText>Your Repository</ListItemText>
                </ListItemButton>
            </Tooltip>

            <Tooltip title="Your Teams" placement="right">
                <ListItemButton key="collaboration">
                    <ListItemIcon className={classes.icon}>
                        <span className="material-symbols-rounded" style={{color: theme.palette.text.primary }}>
                        groups
                        </span>
                    </ListItemIcon>
                    <ListItemText>Your Teams</ListItemText>
                </ListItemButton>
            </Tooltip>
            <Divider />
        </List>
    );
}

export default SideBar;