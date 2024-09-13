import {styled} from "@mui/material/styles";
import {ToggleButton} from "@mui/material";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
    '&.Mui-selected, &.Mui-selected:hover': {
        color: theme.palette.getContrastText('#90CAF9'), // Ensures text is readable
        backgroundColor: '#90CAF9', // The color you specified
        '&:hover': {
            backgroundColor: '#64B5F6', // A slightly darker shade for hover effect
        },
    },
    '&:not(.Mui-selected)': {
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    borderColor: '#90CAF9',
    '&:not(:first-of-type)': {
        borderLeft: '1px solid #90CAF9 !important',
    },
}));

export default StyledToggleButton;