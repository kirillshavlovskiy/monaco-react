import React, { useState, useEffect, useRef, memo } from 'react';
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Divider from "@material-ui/core/Divider";
import {MyPaper} from 'theme';
import {styled, useTheme} from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import ReplyIcon from "@mui/icons-material/Reply";

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

            > {/* Added a wrapper with controlled width */}

                <MyPaper className={classes.editor}>
                    <Typography variant="h5"
                                sx={{ marginLeft: '20px' }}
                    >
                        Terminal
                    </Typography>
                    <div className={classes.editorWrapper}>
                        <MonacoEditor
                            key="monaco_editor"
                            theme={monacoTheme}
                            height="70vh"
                            width="90vh"
                            path={language}
                            defaultValue={examples[selectedLanguageId] || ''}
                            defaultLanguage={language}
                            options={options}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}
                        />
                    </div>
                    <div className={classes.buttonContainer}>

                    <div className={classes.spacer}/>

                    <Button className={classes.execute_button}
                            variant="contained"
                            disabled={!isEditorReady}
                            endIcon={<PlayArrowIcon/>}
                            onClick={handleApply}

                    >
                        Run
                    </Button>
                    </div>
                </MyPaper>
            </div>
            <Console/>
            {isSettingsVisible &&
                <Drawer
                    variant="permanent"

                >
                    <Settings/>
                </Drawer>
            }

    </div>
    );
}

export default Editor;