import { makeStyles } from '@material-ui/core/styles';

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      width: '100%',
      height: '100%',
      display: 'flex',
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

    terminal: {
      flexGrow: 1,
        paddingLeft: ({isMobile}) => isMobile ? 0 : 0,
      '& button': {
        marginRight: 0,


      },
    },
    editor: {
      marginBottom: 12,
      marginTop: 20,
      marginRight: 15,
      paddingTop: -5,

    },
    editorWrapper: {
      backgroundColor: '#1D1D1D',
      border: '2px solid #2B2D30',
      borderRadius: '5px',
      '& .MonacoEditor': { // If MonacoEditor renders a div with a class, it will apply these styles.
        borderRadius: '5px',
      },
      paddingRight: 0,
      marginBottom: 10,

    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginRight: 0,
    },
    execute_button: {
      marginTop: 15,
      marginButtom: 0,
      backgroundColor: '#90CAF9',
    },
    tab: {
      margin: 0,
      padding: 0,
      // Include other CSS rules as needed
    },
  }));

export default useStyles;