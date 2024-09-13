import React, {useState, useRef, useEffect} from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
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
import axios from 'axios';
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import {CustomTextField} from "theme";
import {StyledToggleButton} from "theme";


const PRIMARY_THREAD = { id: '0', name: 'Main Thread' };
const SECONDARY_THREAD = { id: '0', name: 'Main Thread' };
const TEST_THREAD = { id: '0', name: 'Main Thread' };

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
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification, setNewCode },
        effects: { defineTheme, monacoThemes },
    } = useStore();

    const theme = useTheme();
    const editorRef = useRef();
    const [editorContent, setEditorContent] = useState(ai_code || '');
    const [threads, setThreads] = useState([PRIMARY_THREAD]);
    const [selectedThreadId, setSelectedThreadId] = useState(PRIMARY_THREAD.id);
    const [isLoading, setIsLoading] = useState(true);
    const { state: { editor: themeBackground, fontColor, isSettingsVisible, isSideBarVisible }, actions: setThemeBackground } = useStore();
    const language = config.supportedLanguages.find(({ id }) => id === selectedLanguageId).name;
    const [consoleValue, setConsoleValue] = React.useState(0);
    const [fontClr, setFontClr] = useState(fontColor);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/threads/');
            if (response.data.length > 0) {
                setThreads([PRIMARY_THREAD, ...response.data]);
            } else {
                // If no threads from API, we already have the default thread
                setThreads([PRIMARY_THREAD]);
            }
            // Always select the default thread if no thread is currently selected
            if (!selectedThreadId) {
                setSelectedThreadId(PRIMARY_THREAD.id);
            }
        } catch (error) {
            console.error("Error fetching threads:", error);
            showNotification('Error fetching threads', 'error');
            // In case of error, we still have the default thread
            setThreads([PRIMARY_THREAD]);
            setSelectedThreadId(PRIMARY_THREAD.id);
        }
        setIsLoading(false);
    };

    const handleThreadChange = (event) => {
        setSelectedThreadId(event.target.value);
    };

    const createNewThread = async (name = `Thread ${threads.length + 1}`) => {
        try {
            const response = await axios.post('/api/threads/', { name });
            const newThread = response.data;
            setThreads(prevThreads => [...prevThreads, newThread]);
            setSelectedThreadId(newThread.id);
            return newThread;
        } catch (error) {
            console.error("Error creating new thread:", error);
            showNotification('Error creating new thread', 'error');
        }
    };
    const handleThreadMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleThreadMenuClose = () => {
        setAnchorEl(null);
    };

    const handleThreadSelect = (threadId) => {
        setSelectedThreadId(threadId);
        handleThreadMenuClose();
    };


    const handleChange = (event, newValue) => {
        setConsoleValue(newValue);
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
        setEditorContent(newValue);
        console.log('updated code:', newValue);
    };

    const StyledBox = styled(Box)(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: theme.spacing(2),
    }));


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
                <StyledTab className={classes.tab} label="Primary Thread" />
                <StyledTab className={classes.tab} label="Secondary Thread" />
                <StyledTab className={classes.tab} label="Test Thread" />

            </StyledTabs>

                    {/*<Box sx={{ display: 'flex', alignItems: 'center', marginTop: -2.5 }}>*/}
                    {/*    <FormControl variant="filled" sx={{ minWidth: 120, mr: 2 }} size="small">*/}
                    {/*        <CustomTextField*/}
                    {/*            select*/}
                    {/*            variant="filled"*/}
                    {/*            value={selectedThreadId}*/}
                    {/*            onChange={handleThreadChange}*/}
                    {/*            label="Thread"*/}
                    {/*        >*/}
                    {/*            {threads.map(thread => (*/}
                    {/*                <MenuItem key={thread.id} value={thread.id}>*/}
                    {/*                    {thread.name}*/}
                    {/*                </MenuItem>*/}
                    {/*            ))}*/}
                    {/*        </CustomTextField>*/}
                    {/*    </FormControl>*/}
                    {/*</Box>*/}


                {consoleValue === 0 && (
                    isLoading ? (
                        <Typography>Loading chat...</Typography>
                    ) : (
                        <Chat threadId={0} />
                    )
                )}
            {consoleValue === 1 && (
                isLoading ? (
                    <Typography>Loading chat...</Typography>
                ) : (
                    <Chat threadId={1} />
                )
            )}
            {consoleValue === 2 && (
                isLoading ? (
                    <Typography>Loading chat...</Typography>
                ) : (
                    <Chat threadId={2} />
                )
            )}

        </MyPaper>
    </div>
    )

};

export default Console;
