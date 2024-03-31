import * as React from 'react';
import List from '@mui/material/List';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import TerminalRoundedIcon from "@mui/icons-material/TerminalRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import CableRoundedIcon from '@mui/icons-material/CableRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import {ListItemButton} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import useStyles from './useStyles';
import Divider from "@mui/material/Divider";
import { MuiThemeProvider } from 'theme';
import {styled, useTheme} from "@mui/material/styles";
export default function SideBar() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const theme=useTheme();
      return  (
          <MuiThemeProvider>
          <List className={classes.root}>
              <ListItemButton key={"study"}>
                  <ListItemIcon className={open ? null : classes.icon}>
                      <SchoolRoundedIcon style={{ fontSize: 25, color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText>Learn</ListItemText>
              </ListItemButton>

              <ListItemButton key={"terminal"}>
                  <ListItemIcon className={open ? null : classes.icon}>
                      <TerminalRoundedIcon style={{ fontSize: 25, color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText>Playgorund</ListItemText>
              </ListItemButton>

              <ListItemButton key={"project_tree"}>
                  <ListItemIcon className={open ? null : classes.icon}>
                      <AccountTreeRoundedIcon style={{ fontSize: 25, color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText >Your Projects</ListItemText>
              </ListItemButton>

              <ListItemButton key={"repository"}>
                  <ListItemIcon className={open ? null : classes.icon}>
                      <CableRoundedIcon style={{ fontSize: 25, color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText>Your Repository</ListItemText>
              </ListItemButton>

              <ListItemButton key={"collaboration"}>
                  <ListItemIcon className={open ? null : classes.icon}>
                      <Groups2RoundedIcon style={{ fontSize: 25, color: theme.palette.text.primary }} />
                  </ListItemIcon>
                  <ListItemText>Your Teams</ListItemText>
              </ListItemButton>
              <Divider />
          </List>
          </MuiThemeProvider>
    )
}