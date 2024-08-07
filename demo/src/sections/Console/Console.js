import React, {useState, useRef, useEffect} from 'react';
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
import { withStyles } from '@material-ui/core/styles';
import Chat from "../Chat/Chat";
import Editor_Agent from "../Editor";
import ChatComponent from "../Chat/ChatComponent";
import MonacoEditor from "@monaco-editor/react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@mui/material/Box";
import ai_code from "../../config/ai";
import Interface from "../Editor/Interface/Interface";
import examples from "../../config/examples";

const CustomDivider = withStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.primary
        // Add marginLeft and marginRight for horizontal margins
    },
}))(Divider);


const Console = _ => {
    const classes = useStyles({ isMobile });
    const [isEditorReady, setIsEditorReady] = useState(false);
    const {
        state: { editor: { selectedLanguageId, options }, monacoTheme },
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification, setNewCode},
        effects: { defineTheme, monacoThemes },
    } = useStore();

    const [messages, setMessages] = useState([]);
    const theme = useTheme()
    const editorRef = useRef();
    const [consoleText, setConsoleText] = useState(''); // Store received messages from backend
    const [editorContent, setEditorContent] = useState(ai_code || '');
    //const [editorWidth, setEditorWidth] = useState('50%');

    const { state: { editor: themeBackground, fontColor, isSettingsVisible, isSideBarVisible }, actions: setThemeBackground } = useStore();
    const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;
    const [newEditorContent, setNewEditorContent] = useState(ai_code || '');
    const [consoleValue, setConsoleValue] = React.useState(0);
    const [fontClr, setFontClr] = useState(fontColor);


    const handleChange = (event, newAIValue) => {
        setConsoleValue(newAIValue);
    };
    function handleEditorWillMount(monaco) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            module: monaco.languages.typescript.ModuleKind.ES2015,
            allowNonTsExtensions: true,
            lib: ['es2018'],
        });
    }
    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor; // Assign editor instance
        //editorRef.current.layout(); // Force editor's layout adjustfunction handleEditorDidMount(editor, monaco) {
        setIsEditorReady(true);
        setNewCode(editorRef.current?.getValue());
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
    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    const handleEditorChange = (newValue) => {
        setNewCode(newValue);
        setEditorContent(newValue);  // Update context with new content
        console.log('updated code:', newValue);
    };

    return (
    <div className={classes.root}>
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
                value={consoleValue}
                onChange={handleChange}
                aria-label="styled tabs example"
                className={classes.tabsStyled}
                style={{marginTop: "-20px", marginBottom: "15px", hight: "7.5px"}}
            >
                <StyledTab className={classes.tab} label="Agent Console" />
                <StyledTab className={classes.tab} label="Code" />
                <StyledTab className={classes.tab} label="Visual Board" />

            </StyledTabs>

            {consoleValue === 0 && (
                <Chat />
            )}
            {consoleValue === 1 && (
                <MonacoEditor
                key="monaco_editor"
                theme={monacoTheme}
                height="69.5vh"
                width="75vh"
                path={language}
                defaultValue={editorContent}
                defaultLanguage={language}
                options={options}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}

                onChange={handleEditorChange}
                />
            )}
            {consoleValue === 2 && (
                <ChatComponent/>
            )}

        </MyPaper>
    </div>
    )

};

export default Console;
