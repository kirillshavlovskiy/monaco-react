import React, {useState, useRef} from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Editor from '@monaco-editor/react';
import { useStore } from 'store';
import config from 'config';
import { isMobile } from 'utils';
import useStyles from './useStyles';
import {styled} from "@mui/material/styles";
import Paper from "@material-ui/core/Paper";

const MyPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    button: {
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
    },
}));

const Settings = _ => {
    const classes = useStyles({ isMobile });
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {
        state: { editor: { selectedLanguageId, options }, monacoTheme },
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification },
        effects: { defineTheme, monacoThemes },
    } = useStore();

    const editorRef = useRef();

    function handleLanguageChange(ev) {
        setSelectedLanguageId(ev.target.value);
    }

    function handleThemeChange(ev) {
        const theme = ev.target.value;

        if (config.defaultThemes.includes(theme)) {
            setMonacoTheme(theme);
        } else {
            defineTheme(theme).then(_ => setMonacoTheme(theme));
        }
    }

    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleEditorDidMount(editor, monaco) {
        setIsEditorReady(true);
        editorRef.current = editor;
    }

    function handleApply() {
        const currentValue = getEditorValue();

    }


    return (
        <MyPaper className={classes.root}>

            <Typography variant="h5">AI Console</Typography>
            <Divider />
                <div className={classes.editor}>
                    <Editor
                        theme={monacoTheme}
                        language="markdown"
                        height="70vh"
                        value=''
                        onMount={handleEditorDidMount}
                    />
                    <Button className={classes.execute_button} variant="outlined" disabled={!isEditorReady} onClick={handleApply}>Apply</Button>
                </div>
                        </MyPaper>
    );
};

export default Settings;
