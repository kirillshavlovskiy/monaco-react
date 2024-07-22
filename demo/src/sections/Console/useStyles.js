import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    '& .MuiTab-root': {
      minWidth: 75,
      fontSize: "1.1rem",
      fontWeight: 400, // set the font weight to 100 (lightest)
      marginRight: theme.spacing(0),
      '& .MuiTab-textColorInherit': {
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        lineHeight: 1.3,
        textTransform: 'none',
        marginRight: theme.spacing(0),
        paddingBottom: 0,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        letterSpacing: '0em',
        minHeight:44,
      },
    },
    indicator: {
      backgroundColor: 'white',
      height: '0.25rem',
    },

  },

}));

export default useStyles;