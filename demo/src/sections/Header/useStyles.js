import { makeStyles } from '@material-ui/core/styles';
const drawerTopMargin = "64px";

const useStyles = makeStyles(theme => ({
  root: {
  },
  title: {
  flexGrow: 1,
  fontWeight: 400,
  fontSize: 36,
  marginLeft: 25,
  },
  logo: {
  marginRight: theme.spacing(1),
  fontWeight: 700,
  fontSize: 36,
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
  }
}));

export default useStyles;