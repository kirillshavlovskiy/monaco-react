import { makeStyles } from '@material-ui/core/styles';

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',


    },

    terminal: {
      flexGrow: 1,
        paddingLeft: ({isMobile}) => isMobile ? 0 : 0,
      '& button': {
        marginRight: 35,


      },
    },
    editor: {
      marginBottom: 12,
      marginTop: 12,
      marginRight: 12,
      padding: 10,
    },
    editorWrapper: {
      backgroundColor: '#1D1D1D',
      border: '1px solid #1D1D1D',
      borderRadius: '5px',
      '& .MonacoEditor': { // If MonacoEditor renders a div with a class, it will apply these styles.
        borderRadius: '5px',
      },
      padding: 2,
      marginTop: 10,
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    spacer: {
      flex: 1,
    },
    execute_button: {
      marginTop: 15,
      marginButtom: 0,
    }
  }));

export default useStyles;