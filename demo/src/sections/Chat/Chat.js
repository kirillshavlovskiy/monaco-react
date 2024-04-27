import './styles.css';
import React, {createContext, useContext, useState, useRef, useEffect} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import {useStore} from "../../store";
import {useTheme} from "@mui/material/styles";
import useStyles from "../Editor/useStyles";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import copy from 'copy-to-clipboard';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Import the style
import Button from '@mui/material/Button';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import {Tooltip} from "@mui/material";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'; // Include this for GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw'; // Include this to allow raw HTM
import { MessageBox } from 'react-chat-elements';



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
    const MessageBoxWrapper = ({ message, className }) => {
        // Choose the right class based on the direction of message
        const messageClass = message.direction === 'outgoing' ? 'outgoing' : 'incoming';

        if (message.direction === 'outgoing') {
            // Apply CSS classes using a template literal
            return <div className={`message-box ${messageClass} ${className}`}>
                <ReactMarkdown
                    children={message.message}
                    //remarkPlugins={[gfm]}
                    //rehypePlugins={[rehypeRaw]}
                    components={customRenderer}
                >{message.message}</ReactMarkdown>
                </div>;
        } else {
            // Apply CSS classes using a template literal
            return <div className={`message-box ${messageClass} ${className}`}>
                <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>;
        }
    };
    useEffect(() => {
        webSocket.current = new WebSocket("ws://localhost:8000/ws/livechat_autogen/");
        webSocket.current.onopen = () => console.log("WebSocket open");

        webSocket.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const incomingMessage = data.message;
                const codeBlocks = extractCodeBlocks(incomingMessage);
                const textBlocks = splitTextAndCode(incomingMessage, codeBlocks);
                const newMessages = [];

                textBlocks.forEach((block, index) => {
                    if (block.isCode) {
                        newMessages.push({
                            message: block.content,
                            direction: 'incoming',
                            sender: 'Server',
                            isPythonCode: block.language === 'python',
                            language: block.language
                        });
                    } else {
                        newMessages.push({
                            message: block.content,
                            direction: 'incoming',
                            sender: 'Server',
                            isPythonCode: false
                        });
                    }

                    // Add a text message after each code block, if there is a following text block
                    if (index < textBlocks.length - 1 && !textBlocks[index + 1].isCode) {
                        newMessages.push({
                            message: textBlocks[index + 1].content,
                            direction: 'incoming',
                            sender: 'Server',
                            isPythonCode: false
                        });
                    }
                });

                setMessages(messages => [...messages, ...newMessages]);
                setIsTyping(!incomingMessage.includes('to: Admin'));
            } catch (error) {
                console.error("Error parsing server response: ", error);
            }
        };

        webSocket.current.onerror = (event) => console.error("WebSocket error observed:", event);
        webSocket.current.onclose = (event) => console.log("WebSocket closed connection:", event);

        return () => webSocket.current.close();
    }, []);

// Helper function to extract code blocks and their languages
    function extractCodeBlocks(text) {
        const codeBlockRegex = /```(.*?)```/gs;
        const matches = text.match(codeBlockRegex);
        return matches ? matches.map(match => {
            const lines = match.split('\n');
            const language = lines[0].slice(3); // Remove the `` ` and get the language
            const code = lines.slice(1, -1).join('\n'); // Join the code lines
            return { language, code };
        }) : [];
    }

// Helper function to split text and code blocks
    function splitTextAndCode(text, codeBlocks) {
        let parts = text.split(/```[\s\S]*?```/gs); // Split by code blocks
        let blocks = parts.reduce((acc, part, index) => {
            if (index % 2 === 0) {
                // Text block
                acc.push({ content: part, isCode: false });
            } else {
                // Code block
                const language = codeBlocks[Math.floor(index / 2)].language;
                acc.push({ content: codeBlocks[Math.floor(index / 2)].code, isCode: true, language });
            }
            return acc;
        }, []);

        // Ensure we start and end with a text block
        if (blocks[0].isCode) {
            blocks.unshift({ content: '', isCode: false });
        }
        if (blocks[blocks.length - 1].isCode) {
            blocks.push({ content: '', isCode: false });
        }

        return blocks;
    }

    const customRenderer = {
        heading(props) {
            const level = props.level;
            const children = props.children;
            return <h1 style={{ fontSize: `2rem - ${(level - 1) * 0.5}rem` }}>{children}</h1>;
        },
        // ... (other custom renderers if needed)
    };

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
                            style={{ display: 'flex', flexDirection: 'column' }}
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="Autogen is typing" /> : null}
                        >
                            {messages.map((message, i) => (
                                <div
                                    key={i}
                                    style={{
                                        textAlign: message.direction === 'outgoing' ? 'right' : 'left',
                                        alignSelf: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {message.isPythonCode ? (
                                        <div style={{ backgroundColor: '#2B2B2B', borderRadius: '5px', padding: '5px', marginTop: '2.5px',  }}>

                                                <Tooltip title="Copy">
                                                    <IconButton
                                                        style={{ color: "#EDECE4" }}
                                                        size="small"
                                                        onClick={() => copy(message.message)}
                                                    >
                                                        <ContentCopyRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Execute Code">
                                                    <IconButton
                                                        style={{ color: "#EDECE4" }}
                                                        size="small"
                                                        onClick={() => runNewCode(message.message)}
                                                    >
                                                        <PlayArrowRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            <SyntaxHighlighter language="python" style={darcula} customStyle={{ fontSize: '12px' }}>
                                                {message.message}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <MessageBoxWrapper style={{ margin: '10px 0' }} message={message} />
                                    )}
                                </div>
                            ))}
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