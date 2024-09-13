import React, { useState, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import MonacoEditor from '@monaco-editor/react';
import Interface from './Interface/Interface';
import FileSystem from 'sections/FileSystem';
import Console from 'sections/Console';
import { useStore } from 'store';
import examples from 'config/examples';
import config from 'config';
import useStyles from './useStyles';
import Button from "@material-ui/core/Button";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import {MyPaper} from 'theme';
import {styled, useTheme} from "@mui/material/styles";
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Box from '@mui/material/Box';
import ChatContext from './ChatContext.js';

const StateLogger = () => {
    const { newCode, editorTab, openedFile } = useStore(state => ({
        newCode: state.newCode,
        editorTab: state.editorTab,
        openedFile: state.openedFile
    }));

    useEffect(() => {
        console.log('Relevant state updated:', { newCode, editorTab, openedFile });
    }, [newCode, editorTab, openedFile]);

    return null;
};

const Editor = () => {
    const { state, actions } = useStore();
    const theme = useTheme();
    const classes = useStyles();
    const webSocket = useRef(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    const [lastFileName, setLastFileName] = useState('');
    const {
        state: {
            editor: {selectedLanguageId, options},
            monacoTheme,
            themeBackground,
            fontColor,
            newCode,
            editorTab,
            isSettingsVisible,
            isSideBarVisible,
            openedFile
        },
        actions: {setNewCode, setEditorTab}
    } = useStore();
    const interfaceRef = useRef(null);
    const language = config.supportedLanguages.find(({id}) => id === selectedLanguageId).name;
    const editorRef = useRef();
    const [message, setMessage] = useState("");
    const [value, setValue] = React.useState(0);
    const [fontClr, setFontClr] = useState(fontColor);
    const [editorContent, setEditorContent] = useState(() => examples[selectedLanguageId] || '');
    const [currentLanguage, setCurrentLanguage] = useState(() => config.supportedLanguages.find(({id}) => id === selectedLanguageId).name);

    const fileSystemSocketRef = useRef(null);

    const handleChange = (event, newValue) => {
        setEditorTab(newValue);
    };

    useEffect(() => {
        setNewCode(editorContent);
    }, []);

    useEffect(() => {
        if (interfaceRef.current) {
            interfaceRef.current.setVisibility(editorTab === 1);
        }
    }, [editorTab]);

    const getLanguageFromFileName = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        const languageMap = {
            'py': 'python',
            'js': 'react',
            'html': 'html',
            'css': 'css',
            'json': 'json',
        };
        return languageMap[extension] || 'react';
    };

    const connectFileSystemWebSocket = () => {
        const ws = new WebSocket('ws://localhost:8000/ws/file_structure/');

        ws.onopen = () => {
            console.log('File System WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'file_content' && data.id === openedFile?.id) {
                setEditorContent(data.content);
                setNewCode(data.content);
            }
            // Handle other message types...
        };

        ws.onerror = (error) => {
            console.error('File System WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('File System WebSocket disconnected');
            // Attempt to reconnect after a delay
            setTimeout(connectFileSystemWebSocket, 3000);
        };

        fileSystemSocketRef.current = ws;
    };

    useEffect(() => {
        connectFileSystemWebSocket();
        return () => {
            if (fileSystemSocketRef.current) {
                fileSystemSocketRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        console.log('newCode changed:', newCode);
        if (newCode !== editorContent) {
            setEditorContent(newCode);
        }
    }, [newCode]);

    useEffect(() => {
        console.log('openedFile changed:', openedFile);
    }, [openedFile]);

    useEffect(() => {
        console.log('Editor: editorTab changed:', state.editorTab);
    }, [state.editorTab]);

    useEffect(() => {
        if (isEditorReady && editorRef.current) {
            const currentValue = editorRef.current.getValue();
            if (editorContent !== currentValue) {
                editorRef.current.setValue(editorContent);
            }
        }
    }, [editorContent, isEditorReady]);

    useEffect(() => {
        console.log('openedFile changed:', openedFile);
        if (openedFile) {
            setCurrentLanguage(getLanguageFromFileName(openedFile.name));
            if (fileSystemSocketRef.current && fileSystemSocketRef.current.readyState === WebSocket.OPEN) {
                fileSystemSocketRef.current.send(JSON.stringify({
                    action: 'get_file_content',
                    id: openedFile.id
                }));
            }
        } else {
            setCurrentLanguage('react');
            setEditorContent(examples['react'] || '');
            setNewCode(examples['react'] || '');
        }
    }, [openedFile, setNewCode]);

    useEffect(() => {
        setFontClr(fontColor);
    }, [fontColor]);

    function handleEditorWillMount(monaco) {
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.Latest,
            module: monaco.languages.typescript.ModuleKind.ES2015,
            allowNonTsExtensions: true,
            lib: ['es2018'],
        });
    }

    function handleEditorDidMount(editor, monaco) {
        console.log('Editor mounted');
        editorRef.current = editor;
        setIsEditorReady(true);
        editor.setValue(editorContent);
        setNewCode(editorContent);
    }

    const debouncedHandleEditorChange = React.useCallback(
        debounce((value) => {
            console.log('Editor content changed:', value.slice(0, 50) + '...');
            setEditorContent(value);
            setNewCode(value);

            if (openedFile) {
                console.log('Updating opened file:', openedFile.name);
                if (fileSystemSocketRef.current && fileSystemSocketRef.current.readyState === WebSocket.OPEN) {
                    const message = JSON.stringify({
                        action: 'update_file_content',
                        id: openedFile.id,
                        content: value
                    });
                    console.log('Sending update message:', message.slice(0, 100) + '...');
                    fileSystemSocketRef.current.send(message);
                } else {
                    console.log('WebSocket is not ready for sending');
                }
            } else {
                console.log('No file is currently opened. Changes will be saved in local state.');
            }
        }, 1000),
        [openedFile, setNewCode]
    );


    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    const StyledTabs = styled((props) => (
        <Tabs
            {...props}
            TabIndicatorProps={{children: <span className="MuiTabs-indicatorSpan"/>}}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'transparent',
        },
        '& .MuiTabs-indicatorSpan': {
            maxWidth: 100,
            width: '100%',
            backgroundColor: fontClr,
        },
    });

    const StyledTab = styled((props) => (
        <Tab
            disableRipple
            {...props}
            label={
                <Box p={0}>
                    {props.label}
                </Box>}
        />
    ))(({theme}) => ({
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

    const [messages, setMessages] = useState([]);
    const pythonContentRegex = /(?<=```python\n)[\s\S]+(?=\n```)/gm;
    const pythonCodeRegex = /(?:\s*)(?:(?:\bprint\s*\(.*?\)\s*)|(?:\bfor.*?:\s*print.*?))/g;
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async (rawMessage) => {
        const message = stripHTMLTags(rawMessage);
        const isPythonCode = message.match(pythonContentRegex) !== null;
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: 'Admin',
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(!message.includes('to: Admin'));
        if (webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({message: newMessage.message}));
            setMessage("");
        }
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    function stripHTMLTags(text) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        const plainText = tempElement.textContent || tempElement.innerText || '';
        return plainText;
    }

    const handleTabChange = (event, newValue) => {
        actions.setEditorTab(newValue);
    };

    async function handleRun() {
        try {
            const code = getEditorValue();
            const inputData = {message: {code: code, input_values: null}};
            const response = await fetch("http://localhost:8000/courses/api/code_execute/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
            const result = await response.json();
            const { completion, image, message, output, prompt_line_n } = result;
            console.log("Execution result:", result);
        } catch (error) {
            console.error("Error in handleRun function: ", error.message);
        }
    }

    async function handleImprove() {
        try {
            const code = getEditorValue();
            const inputData = {message: {code: code, input_values: null}};
            const response = await fetch("http://localhost:8000/courses/api/code_execute/", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(inputData),
            });
            const result = await response.json();
            const { completion, image, message, output, prompt_line_n } = result;
            console.log("Execution result:", result);
            webSocket.current.send(JSON.stringify({ message: `Check my code below:\n${code}\n\n***Execution Result***:\n${output}\nPlease suggest improvements to fix errors and improve program's functionality` }));
        } catch (error) {
            console.error("Error in handleImprove function: ", error.message);
        }
    }

    function ChatProvider({ children }) {
        const functionValue = {
            messages,
            sendMessage,
            handleRun,
            handleImprove,
        };
        return <ChatContext.Provider value={functionValue}>{children}</ChatContext.Provider>;
    }



    return (
        <div className={classes.root}>
            <StateLogger />
            <div className={classes.terminal}>
                <MyPaper className={classes.editor} sx={{ bgcolor: themeBackground, color: fontColor }}>
                    <StyledTabs
                        value={editorTab}
                        onChange={handleTabChange}
                        aria-label="editor tabs"
                        className={classes.tabsStyled}
                        style={{marginTop: "-20px", marginBottom: "10px", height: "7.5px"}}
                    >
                        <StyledTab className={classes.tab} label="Terminal" />
                        <StyledTab className={classes.tab} label="Interface" />
                        <StyledTab className={classes.tab} label="File System" />
                        <StyledTab className={classes.tab} label="Data Space" />
                        <StyledTab className={classes.tab} label="Smart Notes" />
                    </StyledTabs>

                    {editorTab === 0 && (
                        <div>
                            <MonacoEditor

                                key="monaco_editor"
                                theme={monacoTheme}
                                height="70.2vh"

                                language={language}
                                value={editorContent}
                                options={options}
                                onMount={handleEditorDidMount}
                                onChange={debouncedHandleEditorChange}
                            />
                            <div className={classes.buttonContainer}>
                                <div className={classes.spacer}/>
                                <Button className={classes.execute_button}
                                        variant="contained"
                                        disabled={!isEditorReady}
                                        endIcon={<HandymanRoundedIcon/>}
                                        onClick={handleImprove}
                                >
                                    FIX
                                </Button>
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
                        </div>
                    )}

                    <Interface
                        ref={interfaceRef}
                        code={editorContent}
                        language={currentLanguage}
                        fileName={openedFile?.name || 'rendered-test-component.js'}
                        isVisible={editorTab === 1}
                    />

                    {editorTab === 2 && (
                        state.user ? <FileSystem /> :
                            <div style={{height: "76.5vh"}}>Please log in to access the file
                                system.</div>
                    )}

                </MyPaper>
                </div>
                <div className={classes.console}>
                    <Console/>
                </div>


            </div>
        );
    }

    export default Editor;