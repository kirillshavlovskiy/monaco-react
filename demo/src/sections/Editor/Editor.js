import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Settings from 'sections/Settings';
import Structure from 'sections/Structure';
import { useStore } from 'store';
import { isMobile } from 'utils';
import examples from 'config/examples';
import config from 'config';

import useStyles from './useStyles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const Editor = () => {
    const editorRef = useRef();
    const classes = useStyles();
    const [editorWidth, setEditorWidth] = useState('100%');
    const { state: { editor: { selectedLanguageId, options }, monacoTheme, isSettingsVisible } } = useStore();

    const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;

    // Added drawer related state and toggle functions
    const [open, setOpen] = useState(true);
    function handleDrawerToggle() {
        setOpen(!open);
    }

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
        editorRef.current.layout(); // Force editor's layout adjust
    }

    useEffect(() => {
        if (isSettingsVisible) {
            setEditorWidth('66%');
        } else {
            setEditorWidth('100%');
        }
    }, [isSettingsVisible]);


    return (
        <div className={classes.root}>
            {/* Added Drawer for the side menu */}
            <Drawer variant="persistent" anchor="left" open={open}>
                <IconButton onClick={handleDrawerToggle}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                {/* Add your side menu component here */}
                <Structure />
            </Drawer>

            {
                !isMobile && (
                    <MonacoEditor
                        key={editorWidth}
                        theme={monacoTheme}
                        height="100vh"
                        fontSize="16"
                        fontFamily="monospace"
                        path={language}
                        defaultValue={examples[selectedLanguageId] || ''}
                        defaultLanguage={language}
                        options={options}
                        beforeMount={handleEditorWillMount}
                        onMount={handleEditorDidMount}
                    />
                )
            }
            {isSettingsVisible && <Settings />}
        </div>
    );
}

export default Editor;