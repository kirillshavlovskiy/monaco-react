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
import {TerminalIcon, CopyIcon, PlayIcon, TrashIcon} from '@primer/octicons-react'
import {Tooltip} from "@mui/material";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'; // Include this for GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';
//import marked from 'marked';
import Markdown from 'marked-react';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaCode } from 'react-icons/fa';
import copyToClipboard from 'copy-to-clipboard';
//import { htmlToText } from "html-to-text";

// Helper function to extract code blocks and their languages
function extractCodeBlocks(text) {
    const codeBlockRegex = /```(.*?)\n*([\s\S]+?)```/g;
    const matches = text.match(codeBlockRegex);
    return matches ? matches.map(match => {
        const parts = match.split('\n');
        const language = parts[0].slice(3); // Remove the `` ` and get the language
        let code = parts.slice(parts[1] === '' ? 2 : 1, -1).join('\n'); // Adjust for optional empty line before the code
        // Additional step to remove the trailing ```
        code = code.replace(/```$/, "");
        return { language, code };
    }) : [];
}

function splitTextAndCode(text, codeBlocks) {
    let index = 0;
    let parts = text.split(/(```[\s\S]*?```)/gs); // Split by code blocks
    let blocks = parts.reduce((acc, part, i) => {
        if (i % 2 === 0) {
            // Text block
            acc.push({ content: part, isCode: false });
        } else {
            // Code block
            const language = codeBlocks[index].language;
            acc.push({ content: codeBlocks[index].code, isCode: true, language });
            index++;
        }
        return acc;
    }, []);

    // Ensure we don't end with an empty text block
    if (blocks[blocks.length - 1].isCode) {
        blocks.push({ content: '', isCode: false });
    }

    return blocks;
}


function Chat() {
    const classes = useStyles();
    const theme = useTheme();
    const chatRef = useRef(null);
    const [message, setMessage] = useState("");
    const webSocket = useRef(null);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm Autogen Agent! I can help you with your Python coding!",
            sentTime: "just now",
            sender: "Coding Agent",
            direction: 'incoming',
            context: '',
        }
    ]);

    const {
        state: { editor: { selectedLanguageId, options }, fontColor, themeBackground, newCode, monacoTheme },
        actions: { editor: { setSelectedLanguageId, setOptions, setMonacoTheme}, setNewCode, showNotification },
        effects: { defineTheme, monacoThemes },
    } = useStore();
    const [isTyping, setIsTyping] = useState(false);
    const [code, setCode] = useState(newCode);
    const messageQueue = useRef([]);
    const sendMessage = async (rawMessage) => {
        const message = stripHTMLTags(rawMessage);
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: 'Admin',
            context: newCode,
            session_id: '12345',
        };
        console.log('context:',newCode);
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(!message.includes('to: Admin'));
        if (webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({ message: newMessage.message, context: newMessage.context, sessionId: newMessage.session_id}));
            setMessage("");
        }
    };
    function stripHTMLTags(text) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text;
        const plainText = tempElement.textContent || tempElement.innerText || '';
        return plainText;
    }

    const languageIcons = {
        python: 'Python',
        javascript: 'JavaScript',
        java: 'Java',
        sh: 'Shell',
        // ... add other languages and their corresponding icons or names
    }

    const CodeSnippet = ({ language, code, direction }) => {
        const languageName = languageIcons[language] || language;

        const handleCopyClick = () => {
            copyToClipboard(code);
            // Optionally, show a notification that the code has been copied
        };

        const handleExecuteClick = () => {
            // Implement the logic to execute the code snippet
            runNewCode(code); // Assuming runNewCode is a function to execute the code
        };

        return (
            <div style={{ backgroundColor: '#2B2B2B', borderRadius: '5px', marginTop: '2.5px', marginRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: direction === 'outgoing' ? 'flex-end' : 'flex-start', marginBottom: '2px' }}>
                <span style={{ marginRight: 'auto', backgroundColor: '#EDECE4', marginLeft: '10px', marginTop: '7.5px', padding: '2px 5px', borderRadius: '3px', fontSize: '0.8rem' }}>
                  {languageName} {languageIcons[language] && <FaCode />} {/* Render the icon if available */}
                </span>
                    <div style={{ display: 'flex', gap: '4px', marginRight: '10px',marginTop: '7.5px' }}>
                        <Tooltip title="Copy">
                            <IconButton
                                style={{ color: "#EDECE4" }}
                                size="small"
                                onClick={handleCopyClick}
                            >
                                <CopyIcon size={16} />
                            </IconButton>
                        </Tooltip>
                        {language === 'python' && (
                            <Tooltip title="Add to terminal">
                                <IconButton
                                    style={{ color: "#EDECE4" }}
                                    size="small"
                                    onClick={handleExecuteClick}
                                >
                                    <TerminalIcon size={16} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {language === 'python' && (
                            <Tooltip title="Execute">
                                <IconButton
                                    style={{ color: "#EDECE4" }}
                                    size="small"
                                    onClick={handleExecuteClick}
                                >
                                    <PlayIcon size={16} />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Delete">
                            <IconButton
                                style={{ color: "#EDECE4" }}
                                size="small"
                                onClick={handleCopyClick}
                            >
                                <TrashIcon size={16} />
                            </IconButton>
                        </Tooltip>

                    </div>
                </div>
                <SyntaxHighlighter language={language} style={darcula} customStyle={{ fontSize: '12px', borderRadius: '5px', marginTop: '0px', padding: '10px', marginBottom: '0px' }}>
                    {code}
                </SyntaxHighlighter>
            </div>
        );
    };
    function stripHTMLTagsButKeepWhitespace(text) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Replace angle brackets to prevent HTML parsing
        const plainText = tempElement.textContent || tempElement.innerText || '';
        return plainText.replace(/&lt;/g, '<').replace(/&gt;/g, '>'); // Convert back to angle brackets
    }

    const MyMarkdownComponent = (props) => {
        return (
            <ReactMarkdown
                remarkPlugins={[gfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p({ node, children, ...properties }) {
                        return <span {...properties}>{children}</span>;
                    },
                    code({ node, inline, className, children, ...properties }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...properties}
                                children={String(children).trim()}
                                style={darcula}
                                language={match[1]}
                                PreTag="div"
                            />
                        ) : (
                            <code {...properties} className={className}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {props.markdownText}
            </ReactMarkdown>
        );
    };

    const runNewCode = (snippet) => {
        setSelectedLanguageId(37);
        setNewCode(snippet); // Update the newCode variable with the snippet value
    };

    const MessageBoxWrapper = ({ message, className }) => {
        const messageClass = message.direction === 'outgoing' ? 'outgoing' : 'incoming';

        return (
            <div className={`message-box ${messageClass} ${className}`}
                 style={{paddingLeft: '10px'}}
            >
                <div style={{fontSize: '0.9em', fontWeight: 'bolder', marginBottom: '5px'}}>{message.sender}:</div>
                <MyMarkdownComponent markdownText={message.message} />
            </div>
        );
    };

    const renderMessageBlock = (block, direction) => {
        if (block.type === "text") {
            return  <MyMarkdownComponent markdownText={block.content} />
        } else if (block.type === "code") {
            return (
                <CodeSnippet
                    key={block.content}
                    language={block.language}
                    code={block.content}
                    direction={direction}
                />
            );
        }
        return null;
    };

    const MessageWithBlocks = ({ message, direction }) => {
        return (
            <div style={{ textAlign: direction }}>
                {message.blocks.map((block, index) => (
                    <React.Fragment key={index}>
                        {renderMessageBlock(block, direction)}
                    </React.Fragment>
                ))}
            </div>
        );
    };



    const connectWebSocket = () => {
        if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.close();
        }
        webSocket.current = new WebSocket("ws://localhost:8000/ws/livechat_autogen/");
        webSocket.current.onopen = () => {
            console.log("WebSocket open");
            setIsWebSocketConnected(true);
        };

        webSocket.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.message.sender === "Admin") {
                    console.log("context:", data.message.sender);
                }
                if (data.message.sender === "Coder") {
                }
                const incomingMessage = data.message.text;
                console.log("Incoming message data:", data.message.sender);
                const codeBlocks = extractCodeBlocks(incomingMessage);
                const textBlocks = splitTextAndCode(incomingMessage, codeBlocks);
                const newMessages = textBlocks.map((block, index) => {
                    if (block.isCode) {
                        return { message: block.content, direction: 'incoming', sender: data.message.sender, language: block.language };
                    } else {
                        if (block.content.trim() !== '') {
                            return { message: block.content.trim(), direction: 'incoming', sender: data.message.sender, isPythonCode: false };
                        }
                    }
                }).filter(Boolean);

                // Add new messages to the queue
                messageQueue.current.push(...newMessages);
                setIsTyping(false);
            } catch (error) {
                console.error("Error parsing server response: ", error);
            }
        };

        webSocket.current.onerror = (event) => {
            console.error("WebSocket error observed:", event);
            setIsWebSocketConnected(false);
        };
        webSocket.current.onclose = (event) => {
            console.log("WebSocket closed connection:", event);
            setIsWebSocketConnected(false);
            // Retry connection every 5 seconds if not connected
            setTimeout(() => {
                connectWebSocket();
            }, 5000);
        };
    }

    useEffect(() => {
        if (messageQueue.current.length > 0) {
            const interval = setInterval(() => {
                if (messageQueue.current.length > 0) {
                    const newMessage = messageQueue.current.shift();
                    setMessages(messages => {
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage && lastMessage.sender === newMessage.sender) {
                            const updatedLastMessage = { ...lastMessage, message: lastMessage.message + '\n' + newMessage.message };
                            return [...messages.slice(0, -1), updatedLastMessage];
                        } else {
                            return [...messages, newMessage];
                        }
                    });
                } else {
                    clearInterval(interval);
                }
            }, 4); // Adjust the delay as needed
        }
    }, [messageQueue.current.length]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, []);

    const customRenderer = {
        heading(props) {
            const level = props.level;
            const children = props.children;
            return <h1 style={{ fontSize: `5rem - ${(level - 1) * 0.5}rem` }}>{children}</h1>;
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

    //get newCode for the context analysis
    useEffect(() => {
        // This effect will run whenever `newCode` changes.
        console.log("New code from editor:", newCode);
        // You can use `newCode` here to send messages or perform other actions.
    }, [newCode]);

    return (
        <div ref={chatRef} className="chat-container">
            <div style={{height: "76.5vh", width: "44.5vw"}}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            style={{display: 'flex', flexDirection: 'column'}}
                            scrollBehavior="smooth"
                            typingIndicator={isTyping ? <TypingIndicator content="Autogen is typing"/> : null}
                        >
                            {messages.map((message, i) => (
                                <div
                                    key={i}
                                    style={{
                                        textAlign: message.direction === 'outgoing' ? 'right' : 'left',
                                        alignSelf: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    {message.language && (
                                        <CodeSnippet
                                            language={message.language || 'text'}

                                            code={message.message}
                                            direction={message.direction}
                                            onExecute={runNewCode} // Pass the execute handler as a prop
                                        />
                                    )}
                                    {!message.language && (
                                        <MessageBoxWrapper message={message}/>
                                    )}
                                </div>
                            ))}
                        </MessageList>
                        {isTyping && <TypingIndicator content="Server is typing..."/>}

                            {isWebSocketConnected ? (
                                <MessageInput
                                    placeholder="Type message here"
                                    onSend={(value) => sendMessage(value)}
                                    disabled={!isWebSocketConnected}
                                    style={{color: 'black'}}
                                />
                            ) : (
                                <div>
                                    <MessageInput
                                        placeholder="Disconnected"
                                        disabled={true}
                                        style={{color: 'red'}}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={connectWebSocket}
                                        style={{marginLeft: '10px'}}
                                    >
                                        Reconnect
                                    </Button>
                                </div>
                            )}

                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}

export default Chat;