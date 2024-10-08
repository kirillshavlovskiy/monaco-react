import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginRight: 0,
    },
    execute_button: {
        marginLeft: '10px',
        marginButtom: 0,
        backgroundColor: '#90CAF9',
        color: 'black', // Add this line
        '&:hover': {
            backgroundColor: '#64B5F6',
            color: 'black', // Add this line
        },
    },
}));

export default useStyles;