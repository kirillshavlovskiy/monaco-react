import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

  drawerClosed: { // Create a new class for closed drawer
    display: "flex",
    justifyContent: "center", // Center content horizontally
    alignItems: "center",     // Center content vertically
    // add any additional styles as required
  },
  iconRootClosed: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(1),
  },
  icon: {
    marginLeft: '0px', // adjust the value as per requirement
  },


}));

export default useStyles;