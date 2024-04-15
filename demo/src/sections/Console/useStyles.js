import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    paddingLeft: ({ isMobile }) => isMobile ? 0 : 5,
    '& button': {
    },
    marginRight: 10,
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
    border: `2px solid #686868`,
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
  messenger: {
    marginBottom: 12,
    marginTop: 17,
    border: `2px solid #686868`,
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
  editorWrapper: {
    backgroundColor: '#1D1D1D',
    border: '1px solid #1D1D1D',
    borderRadius: '5px',
    '& .MonacoEditor': { // If MonacoEditor renders a div with a class, it will apply these styles.
      borderRadius: '5px',
    },
    padding: 2,
    margin: 10,
  },
  messangerWrapper: {
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
    backgroundColor: '#90CAF9',
  }
}));

export default useStyles;