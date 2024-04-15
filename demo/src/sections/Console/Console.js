import React, {useState, useRef, useEffect} from 'react';
//import { Chat, Channel, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react';
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
import Paper from "@material-ui/core/Paper";

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
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, showNotification },
        effects: { defineTheme, monacoThemes },
    } = useStore();

    const [messages, setMessages] = useState([]);
    const theme = useTheme()
    const editorRef = useRef();
    const [consoleText, setConsoleText] = useState(''); // Store received messages from backend
    const webSocketRef = useRef(null); // Reference to the WebSocket connection


    function getEditorValue() {
        return editorRef.current?.getValue();
    }

    function handleEditorDidMount(editor, monaco) {
        setIsEditorReady(true);
        editorRef.current = editor;
    }

    function handleSend() {
        const currentValue = getEditorValue();
        webSocketRef.current.send(currentValue); // Send message to the backend using WebSocket
    }

    useEffect(() => {
        webSocketRef.current = new WebSocket('ws://localhost:8000/chat'); // Replace with your WebSocket endpoint
        webSocketRef.current.onmessage = (event) => {
            // Receive messages from backend and update console
            setConsoleText(prevText => prevText + '\n' + event.data);
        };
        return () => {
            webSocketRef.current.close(); // Close WebSocket connection on component unmount
        };
    }, []);

        return (
        <div className={classes.root}>
            <MyPaper className={classes.editor}
                     style={{paddingTop: "-10px"}}
            >
                <Typography variant="h5">AI Console</Typography>
                <div className="chat-container">
                    <ul>
                        {messages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                </div>

                <Divider sx={{my: 2}}/>
                <Editor
                    key="monaco_editor"
                    theme={monacoTheme}
                    language="markdown"
                    height="21vh"
                    width="60vh"

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

                <div className={classes.buttonContainer}>
                    <div className={classes.spacer}/>

                    <Button className={classes.execute_button}
                            variant="contained"
                            disabled={!isEditorReady}
                            endIcon={<ReplyIcon/>}
                            onClick={handleSend}

                    >
                        Run
                    </Button>
                </div>
            </MyPaper>
        </div>
        )

};

export default Console;
