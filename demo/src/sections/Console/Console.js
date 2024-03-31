import React, {useState, useRef} from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Editor from '@monaco-editor/react';
import { useStore } from 'store';
import config from 'config';
import { isMobile } from 'utils';
import useStyles from './useStyles';
import {styled, useTheme} from "@mui/material/styles";
import {MyPaper} from 'theme';
import ReplyIcon from '@mui/icons-material/Reply';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Paper from "@material-ui/core/Paper";
const Settings = _ => {
    const classes = useStyles({ isMobile });
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {
        state: { editor: { selectedLanguageId, options }, monacoTheme },
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification },
        effects: { defineTheme, monacoThemes },
    } = useStore();

    const editorRef = useRef();
    const theme = useTheme()


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
        <div className={classes.root}>
            <MyPaper className={classes.editor}>
                <Typography variant="h5">AI Console</Typography>
                <div className={classes.editorWrapper}>
                    <Editor
                        key="monaco_editor"
                        theme={monacoTheme}
                        language="markdown"
                        height="50vh"

                        value=''
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            scrollbar: {
                                useShadows: false,
                            },
                            lineNumbers: "off",
                            renderLineHighlight: 'none',
                        }}
                    />
                </div>
            </MyPaper>
            <MyPaper className={classes.messenger}
                   sx={{
                           marginTop: 1,
                       }}

            >
                <div className={classes.messangerWrapper}>
                    <Editor
                        key="monaco_editor"
                        theme={monacoTheme}
                        language="markdown"
                        height="11vh"
                        value=''
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: {
                                enabled: false,
                            },
                            scrollbar: {
                                useShadows: false,
                            },
                            lineNumbers: "off",
                            renderLineHighlight: 'none',
                            fontFamily: "monospace",
                            fontSize: "15"
                        }}
                    />
                </div>
                <div className={classes.buttonContainer}>
                <div className={classes.spacer}/>

                <Button className={classes.execute_button}
                        variant="contained"
                        disabled={!isEditorReady}
                        endIcon={<ReplyIcon/>}
                        onClick={handleApply}

                >
                    Run
                </Button>
                </div>
            </MyPaper>
        </div>
    )
        ;
};

export default Settings;
