import './styles.css';
import React, {useState, useRef, useEffect} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import {useStore} from "../../store";
import {useTheme} from "@mui/material/styles";
import useStyles from "../Editor/useStyles";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atelierSulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import copy from 'copy-to-clipboard';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Import the style
import Button from '@mui/material/Button';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import {Tooltip} from "@mui/material";




const pythonContentRegex = /(?<=```python\n)[\s\S]+(?=\n```)/gm;
const pythonCodeRegex = /(?:\s*)(?:(?:\bprint\s*\(.*?\)\s*)|(?:\bfor.*?:\s*print.*?))/g;


function Chat() {
    const classes = useStyles();
    const theme = useTheme();
    const chatRef = useRef(null);
    const [message, setMessage] = useState("");
    const webSocket = useRef(null);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm Autogen Agent! I can help you with your Python coding!",
            sentTime: "just now",
            sender: "ChatGPT",
            direction: 'incoming',
        }
    ]);

    const {
        state: { editor: { selectedLanguageId, options }, fontColor, themeBackground, monacoTheme },
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme }, setNewCode, showNotification },
        effects: { defineTheme, monacoThemes },
    } = useStore();
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
            webSocket.current.send(JSON.stringify({ message: newMessage.message }));
            setMessage("");
        }
    };
    function stripHTMLTags(text) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        const plainText = tempElement.textContent || tempElement.innerText || '';
        return plainText;
    }

    const runNewCode = (snippet) => {
        setSelectedLanguageId(37);
        setNewCode(snippet); // Update the newCode variable with the snippet value
    };
    const renderMessage = (message) => {

            return <div>{message.message}</div>; // Render incoming message as plain text

    };

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

    useEffect(() => {
        if (chatRef.current) {
            const themeBkgd = themeBackground;
            const themeClr = theme.palette.primary.main;
            const textColor = theme.palette.text.primary;
            chatRef.current.style.setProperty('--theme-color', themeClr);
            chatRef.current.style.setProperty('--background-color', themeBkgd);
            chatRef.current.style.setProperty('--text-color', textColor);
        } else { console.error('chatRef.current is not defined'); }
    }, [themeBackground, theme]);
    console.log(fontColor);
    return (
        <div ref={chatRef} className="chat-container">
            <div style={{height: "76.5vh", width: "44.5vw"}}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="Autogen is typing" /> : null}
                        >

                            {messages.map((message, i) => {
                                return (
                                    <div key={i}>
                                        {message.isPythonCode ? (
                                            <div style={{ backgroundColor: '#1E1E1E', borderRight: '1px', borderRadius: '5px'}}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                                                    <Tooltip title="Copy">
                                                        <IconButton
                                                            style={{ color: "#EDECE4" }}
                                                            size="small"
                                                            onClick={() => copy(message.message)}>
                                                            <ContentCopyRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Execute Code">
                                                        <IconButton
                                                            style={{ color: "#EDECE4" }}
                                                            size="small"
                                                            onClick={() => runNewCode(message.message)}>
                                                            <PlayArrowRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                                <SyntaxHighlighter language="python" style={vs2015} customStyle={{fontSize: '12px'}}>
                                                    {message.message}
                                                </SyntaxHighlighter>

                                            </div>
                                        ) : (
                                            <div>
                                                {renderMessage(message)}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </MessageList>
                        {isTyping && <TypingIndicator content="Server is typing..." />}
                        <MessageInput placeholder="Type message here" onSend={(value) => sendMessage(value)}/>
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Chat;