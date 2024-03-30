import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: ({ isMobile }) => isMobile ? 0 : 5,
    '& button': {
      marginRight: 5,
    },
  },
  languages: {
    width: '100%',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    marginBottom: 10,
    marginTop: 10,
  },
  editor: {
    marginBottom: 12,
    marginTop: 12,
    border: `1px solid #E6E6E6`,
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
  execute_button: {
    marginTop: 15,
  }
}));

export default useStyles;