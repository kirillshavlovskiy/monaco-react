import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: 5,
  },
  title: {
    paddingTop: 10,
    paddingBottom: 10,    
  },
}));

export default useStyles;
