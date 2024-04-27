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
    import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
    import {MyPaper} from 'theme';
    import {styled, useTheme} from "@mui/material/styles";
    import Drawer from "@mui/material/Drawer";
    import Tab from '@material-ui/core/Tab';
    import Tabs from '@material-ui/core/Tabs';
    import Box from '@mui/material/Box';
    import axios from 'axios';
    import code from '../../config/code.py'
    // Import ChatContext
    import ChatContext from './ChatContext.js';

    const Editor = () => {
        const theme = useTheme();
        const classes = useStyles();
        const webSocket = useRef(null);
        //const [editorWidth, setEditorWidth] = useState('50%');
        const [isEditorReady, setIsEditorReady] = useState(false);
        const {
            state: {
                editor: {selectedLanguageId, options},
                monacoTheme,
                themeBackground,
                fontColor,
                newCode,
                isSettingsVisible,
                isSideBarVisible
            }, actions: setThemeBackground
        } = useStore();
        const language = config.supportedLanguages.find(({id}) => id === selectedLanguageId).name;
        const editorRef = useRef();
        const [message, setMessage] = useState("");
        const [editorContent, setEditorContent] = useState(examples[selectedLanguageId] || '');
        const [value, setValue] = React.useState(0);
        const [fontClr, setFontClr] = useState(fontColor);
        const [code, setCode] = useState(newCode);
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
        console.log(themeBackground);
        useEffect(() => {
            setFontClr(fontColor);
        }, [fontColor]);

        useEffect(() => {
            if (editorRef.current && newCode !== editorRef.current.getValue()) {
                editorRef.current.setValue(newCode);
            }
        }, [newCode]);

        useEffect(() => {
            if (editorRef.current && code !== editorRef.current.getValue()) {
                editorRef.current.setValue(code);
            }
        }, [code]);

        const [messages, setMessages] = useState([]);
        const pythonContentRegex = /(?<=```python\n)[\s\S]+(?=\n```)/gm;
        const pythonCodeRegex = /(?:\s*)(?:(?:\bprint\s*\(.*?\)\s*)|(?:\bfor.*?:\s*print.*?))/g;
        const [isTyping, setIsTyping] = useState(false);
        const sendMessage = async (rawMessage) => {
            const message = stripHTMLTags(rawMessage);
            const isPythonCode = message.match(pythonContentRegex) !== null;
            const newMessage = {
                message: isPythonCode ? message : message.replace(pythonCodeRegex, ""),
                direction: 'outgoing',
                sender: 'Server',
                isPythonCode: isPythonCode
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

        async function handleRun() {
            try {
                const code = getEditorValue(); // Assuming getEditorValue function gets the code from the editor

                const inputData = {message: {code: code, input_values: null}}; // Prepare the request payload

                const response = await fetch("http://localhost:8000/courses/api/code_execute/", { // replace with your API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputData),
                });

                const result = await response.json(); // Parse the returned JSON
                const { completion, image, message, output, prompt_line_n } = result;
                // Here we log the result to the console
                console.log("Execution result:", result);


            } catch (error) {
                // And in case an error happens in our async function, we also log this error
                console.error("Error in handleImprove function: ", error.message);
            }
    }

        async function handleImprove() {
            try {
                const code = getEditorValue(); // Assuming getEditorValue function gets the code from the editor

                const inputData = {message: {code: code, input_values: null}}; // Prepare the request payload

                const response = await fetch("http://localhost:8000/courses/api/code_execute/", { // replace with your API endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(inputData),
                });

                const result = await response.json(); // Parse the returned JSON
                const { completion, image, message, output, prompt_line_n } = result;
                // Here we log the result to the console
                console.log("Execution result:", result);

                // Then we also send a message to the WebSocket, including the returned result
                webSocket.current.send(JSON.stringify({ message: `Check my code below:\n${code}\n\n***Execution Result***:\n${output}\nPlease suggest improvements to fix errors and improve program's functionality` }));

            } catch (error) {
                // And in case an error happens in our async function, we also log this error
                console.error("Error in handleImprove function: ", error.message);
            }

        }

        function ChatProvider({ children }) {


            const functionValue = {
                messages,  // messages state
                sendMessage,  // sendMessage function
                handleRun,  // handleRun function
                handleImprove,  // handleImprove function
            };
            return <ChatContext.Provider value={functionValue}>{children}</ChatContext.Provider>;
        }
        useEffect(() => {
            webSocket.current = new WebSocket("ws://localhost:8000/ws/livechat_autogen/");
            webSocket.current.onopen = () => console.log("WebSocket open");

            webSocket.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    const incomingMessage = data.message;
                    const incomingMatches = Array.from(incomingMessage.matchAll(pythonContentRegex));
                    const isPythonCode = incomingMatches.length > 0;
                    setMessages(messages => [...messages,
                        {message: isPythonCode ? incomingMatches.map(match => match[0]).join('\n') : incomingMessage, direction: 'incoming', sender: 'Server', isPythonCode: isPythonCode}
                    ]);
                    setIsTyping(!incomingMessage.includes('to: Admin'));
                }
                catch (error) { console.error("Error parsing server response: ", error); }
            };

            webSocket.current.onerror = (event) => console.error("WebSocket error observed:", event);
            webSocket.current.onclose = (event) => console.log("WebSocket closed connection:", event);

            return () => webSocket.current.close();
        }, []);





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
                                height="69.5vh"
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


                </MyPaper>
                </div>
                <Console/>


        </div>
        );
    }

    export default Editor;