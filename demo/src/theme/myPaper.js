import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';
import { useStore } from 'store';

const MyPaperComp = styled(Paper)(({ theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.border.primary}`,
    color: theme.palette.text.primary,
    marginTop: 60,
    padding: 20,
}));

export const MyPaper = ({ monacoTheme, ...props }) => {
    const { state: { themeBackground, fontColor } } = useStore();
    const [themeBkgd, setThemeBkgd] = useState(themeBackground);
    const [fontClr, setFontClr] = useState(fontColor);

    useEffect(() => {
        setThemeBkgd(themeBackground);
    }, [themeBackground]);

    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    return <MyPaperComp {...props} style={{ background: themeBkgd, color: fontClr }} />
}