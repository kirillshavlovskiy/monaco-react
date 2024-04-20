import React, { useState, useEffect, useRef, memo } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Settings from 'sections/Settings';
import Interface from './Interface/Interface';
import Console from 'sections/Console';
import { useStore } from 'store';
import { isMobile } from 'utils';
import examples from 'config/examples';
import config from 'config';
import useStyles from './useStyles';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {MyPaper} from 'theme';
import {styled, useTheme} from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@mui/material/Box';
import axios from 'axios';

const Editor = () => {
    const theme=useTheme();
    const classes = useStyles();
    //const [editorWidth, setEditorWidth] = useState('50%');
    const [isEditorReady, setIsEditorReady] = useState(false);
    const { state: { editor: { selectedLanguageId, options }, monacoTheme, themeBackground, fontColor, isSettingsVisible, isSideBarVisible }, actions: setThemeBackground } = useStore();
    const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;
    const editorRef = useRef();
    const [editorContent, setEditorContent] = useState(examples[selectedLanguageId] || '');
    const [value, setValue] = React.useState(0);
    const [fontClr, setFontClr] = useState(fontColor);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
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
        //editorRef.current.layout(); // Force editor's layout adjustfunction handleEditorDidMount(editor, monaco) {
        setIsEditorReady(true);
    }

    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleRun() {

        const code = getEditorValue();
        fetch("http://localhost:8000/courses/api/message/", code)
            .then(response => response.json())
            .then(data => console.log(data.output));


    }
    const StyledTabs = styled((props) => (
        <Tabs
            {...props}
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 100,
            width: '90%',
            backgroundColor: fontClr,
        },
    });

    const StyledTab = styled((props) => (
        <Tab
            disableRipple
            {...props}
            label={
                <Box p={0}>  {/* Adjust padding here as required */}
                    {props.label}
                </Box>}
        />
    ))(({ theme }) => ({

        '&.Mui-selected': {
            color: fontClr,
        },
        '&:not(:last-child)::after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            height: '50%',
            top: '25%',
            right: 0,
            borderRight: `1px solid ${fontClr}`,
        }
    }));
    console.log(themeBackground);
    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    return (
        <div className={classes.root} >

            <div className={classes.terminal}

            > {/* Added a wrapper with controlled width */}

            <MyPaper className={classes.editor}
                     sx={{
                             '& .Mui-paper': {

                                 bgcolor: theme.palette.mode === theme.palette.background.paper,
                                 color: fontClr,
                                 border: "1px solid #464646"
                             }
                         }}
            >

                <StyledTabs
                    value={value}
                    onChange={handleChange}
                    aria-label="styled tabs example"
                    className={classes.tabsStyled}
                    style={{marginTop: "-20px", marginBottom: "15px", hight: "7.5px"}}
                >
                    <StyledTab className={classes.tab} label="Terminal" />
                    <StyledTab className={classes.tab} label="Interface" />
                    <StyledTab className={classes.tab} label="Board" />
                    <StyledTab className={classes.tab} label="Data Space" />
                    <StyledTab className={classes.tab} label="Smart Notes" />
                </StyledTabs>

                {value === 0 && (
                        <MonacoEditor
                            key="monaco_editor"
                            theme={monacoTheme}
                            height="70vh"
                            width="75vh"
                            path={language}
                            defaultValue={editorContent}
                            defaultLanguage={language}
                            options={options}
                            beforeMount={handleEditorWillMount}
                            onMount={handleEditorDidMount}

                            onChange={(newVal) => setEditorContent(newVal)}
                        />
                )}
                {value === 1 && (
                    <Interface />
                )}
                    <div className={classes.buttonContainer}>

                    <div className={classes.spacer}/>

                    <Button className={classes.execute_button}
                            variant="contained"
                            disabled={!isEditorReady}
                            endIcon={<PlayArrowIcon/>}
                            onClick={handleRun}

                    >
                        Run
                    </Button>

                    </div>


                </MyPaper>
            </div>
            <Console/>


    </div>
    );
}

export default Editor;