import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(1),
    fontWeight: 500,
    fontSize: 24,
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
}));

export default useStyles;