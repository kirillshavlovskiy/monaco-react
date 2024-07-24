import React, { useEffect, useState } from 'react';
import { TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useStore } from "../store";

const StyledTextField = styled(TextField)(({ theme, fontColor, backgroundColor }) => ({
    '& .MuiFilledInput-input': {
        backgroundColor: backgroundColor,
        color: fontColor,
    },
    '& .MuiFilledInput-underline:before': {
        borderBottomColor: theme.palette.primary.main
    },
    '& .MuiFilledInput-underline:after': {
        borderBottomColor: '#90CAF9'
    },
    '& .MuiInputLabel-outlined:not(.MuiInputLabel-shrink)': {
        color: 'green',
    },
    '& .MuiInputLabel-shrink': {
        color: '#90CAF9',
    },
    '& .MuiInputLabel-root': {
        color: fontColor,
    },
    // New styles for focused state
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#90CAF9', // Color when focused
    },
    '& .MuiFilledInput-root:focus-within': {
        '& .MuiInputLabel-root': {
            color: '#90CAF9', // Color when input is focused
        },
    },
}));

export const CustomTextField = (props) => {
    const { state: { themeBackground, fontColor } } = useStore();
    const [themeBkgd, setThemeBkgd] = useState(themeBackground);
    const [fontClr, setFontClr] = useState(fontColor);

    useEffect(() => {
        setThemeBkgd(themeBackground);
    }, [themeBackground]);

    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    return (
        <StyledTextField
            {...props}
            fontColor={fontClr}
            backgroundColor={themeBkgd}
            variant="filled"
        />
    );
};