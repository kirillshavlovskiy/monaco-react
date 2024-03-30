import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Settings from 'sections/Settings';
import Console from 'sections/Console';
import { useStore } from 'store';
import { isMobile } from 'utils';
import examples from 'config/examples';
import config from 'config';
import useStyles from './useStyles';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Paper from '@material-ui/core/Paper';
import {styled, useTheme} from "@mui/material/styles";

const MyPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    button: {
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.text.primary}`,
    },
}));
const Editor = () => {

    const classes = useStyles();
    const [editorWidth, setEditorWidth] = useState('50%');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const { state: { editor: { selectedLanguageId, options }, monacoTheme, isSettingsVisible, isSideBarVisible } } = useStore();
    const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;
    const editorRef = useRef();
    const theme = useTheme();
    function handleEditorWillMount(monaco) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            module: monaco.languages.typescript.ModuleKind.ES2015,
            allowNonTsExtensions: true,
            lib: ['es2018'],
        });
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor; // Assign editor instance
        editorRef.current.layout(); // Force editor's layout adjustfunction handleEditorDidMount(editor, monaco) {
        setIsEditorReady(true);
    }

    useEffect(() => {
        if (isSettingsVisible) {
            setEditorWidth('66%');
        } else {
            setEditorWidth('50%');
        }
    }, [isSettingsVisible]);


    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleApply() {
        const currentValue = getEditorValue();

    }
    console.log(theme.palette.background.paper);
    return (
        <div className={classes.root} >

            <div className={classes.terminal}
                 style={{width: editorWidth}}
            > {/* Added a wrapper with controlled width */}
                <Typography variant="h5">Terminal</Typography>
                <Divider />
                <MyPaper className={classes.editor}>
                        <MonacoEditor
                            key={editorWidth}
                            theme={monacoTheme}
                            height="70vh"
                            path={language}
                            defaultValue={examples[selectedLanguageId] || ''}
                            defaultLanguage={language}
                            options={options}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                        />
                    <Button className={classes.execute_button} variant="outlined" disabled={!isEditorReady} onClick={handleApply} >Execute</Button>

                </MyPaper>
            </div>
            {isSettingsVisible && <Settings />}
            {!isSettingsVisible && <Console />}
    </div>
    );
}

export default Editor;