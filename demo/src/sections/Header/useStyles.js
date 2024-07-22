import { makeStyles } from '@material-ui/core/styles';
const drawerTopMargin = "64px";
const drawerWidth = 200;
const useStyles = makeStyles(theme => ({
  root: {
  },
  title: {
  flexGrow: 1,
  fontWeight: 400,
  fontSize: 36,

  },
  logo: {
  marginRight: theme.spacing(1),
  fontWeight: 700,
  fontSize: 48,
  padding: 2,
  },
  themeSwitcher: {
  transition: '0.8s ease',
  transform: 'rotate(180deg)',
  },
  settingsSwitcher: {
  transition: '0.8s ease',
  transform: 'rotate(180deg)',
  },
  activate: {
  '&:nth-child(1):after': {
    left: 7,
    top: -4,
    opacity: 1,
  },
  '&:nth-child(1):before': {
    left: 9,
    top: -17,
    fontSize: 10,
    opacity: 1,
  },
  '&:nth-child(2):after': {
    left: 21,
    top: -17,
    fontSize: 10,
    opacity: 1,
  },
  '&:nth-child(2):before': {
    display: 'none',
  },
  },
  rotate: {
  transform: 'rotate(0)',
  },
  drawerSettings: {
    marginTop: drawerTopMargin,
    width: 250, // adjust this to your needs
    flexShrink: 0,
  },
  mainContainer: {
    position: 'relative', // Establishing a positioning context for absolutely positioned children
    height: '100vh', // Adjust based on your layout requirements
    overflow: 'hidden', // Prevents scrolling within the container
  },
  mainContent: {
    position: 'absolute',
    top: 50, // Height of your toolbar
    bottom: 0,
    left: drawerWidth, // Width of your sidebar
    right: 0,
    overflow: 'auto', // Enable scrolling within the content area only
  }
}));

export default useStyles;