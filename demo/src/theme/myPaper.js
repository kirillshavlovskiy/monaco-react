// MyPaper.js

import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';

export const MyPaper = styled(Paper)(({ theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.text.secondary}`,
    color: theme.palette.text.primary,
    '& button': {
        color: "#1E1E23",
        border: `0px solid ${theme.palette.text.primary}`,
        backgroundColor: '#90CAF9',

    },

    marginTop: 60,
    padding: 20,


}));