import { makeStyles } from '@material-ui/core/styles';

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 15,
    },

    terminal: {
      flexGrow: 1,
        paddingLeft: ({isMobile}) => isMobile ? 0 : 0,
      '& button': {
        marginRight: 10,

      },
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