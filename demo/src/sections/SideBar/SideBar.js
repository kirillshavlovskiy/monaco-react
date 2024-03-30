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
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import useStyles from './useStyles';
import Divider from "@mui/material/Divider";
import { MuiThemeProvider } from 'theme';
export default function SideBar() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

      return  (
          <MuiThemeProvider>
          <List>
              <ListItemButton key={"study"}>
                  <ListItemIcon className={open ? null : classes.icon} style={{ justifyContent: 'flex-start' }}><SchoolRoundedIcon /></ListItemIcon>
                  <ListItemText>Learn</ListItemText>
              </ListItemButton>
              <Divider />
              <ListItemButton key={"terminal"}>
                  <ListItemIcon className={open ? null : classes.icon} style={{ justifyContent: 'flex-start' }}><TerminalRoundedIcon /></ListItemIcon>
                  <ListItemText>Practice</ListItemText>
              </ListItemButton>
              <Divider />
              <ListItemButton key={"project_tree"}>
                  <ListItemIcon className={open ? null : classes.icon} style={{ justifyContent: 'flex-start' }}><AccountTreeRoundedIcon /></ListItemIcon>
                  <ListItemText>You Projects</ListItemText>
              </ListItemButton>
              <Divider />
              <ListItemButton key={"collaboration"}>
                  <ListItemIcon className={open ? null : classes.icon} style={{ justifyContent: 'flex-start' }}><CableRoundedIcon /></ListItemIcon>
                  <ListItemText>Repository</ListItemText>
              </ListItemButton>
              <Divider />
              <ListItemButton key={"collaboration"}>
                  <ListItemIcon className={open ? null : classes.icon} style={{ justifyContent: 'flex-start' }} ><Groups2RoundedIcon /></ListItemIcon>
                  <ListItemText>Teams</ListItemText>
              </ListItemButton>
          </List>
          </MuiThemeProvider>
    )
}