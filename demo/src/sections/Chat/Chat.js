import './styles.css';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef, useEffect, useCallback} from 'react';
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
import IconButton from "@mui/material/IconButton";
import {TerminalIcon, CopyIcon, PlayIcon, TrashIcon} from '@primer/octicons-react'
import {Tooltip} from "@mui/material";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm'; // Include this for GitHub Flavored Markdown
import rehypeRaw from 'rehype-raw';
import { CircularProgress, Typography } from '@mui/material';
import { FaCode } from 'react-icons/fa';
import copyToClipboard from 'copy-to-clipboard';

const HOST_URL = 'brainpower-ai.net'
const DEFAULT_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";


function Chat({ threadId }) {
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
        state: { fontColor, themeBackground, newCode, uiContext, user, },
        actions: { editor: { setSelectedLanguageId}, setNewCode,  showNotification, setUiContext },
    } = useStore();
    const [isWaiting, setIsWaiting] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const messageQueue = useRef([]);


    const connectWebSocket = useCallback(() => {
        if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.close();
        }

        webSocket.current = new WebSocket(`wss://${HOST_URL}/ws/livechat_autogen/`);

        webSocket.current.onopen = () => {
            console.log("WebSocket open");
            setIsWebSocketConnected(true);
        };

        webSocket.current.onmessage = (event) => {
            console.log("Raw WebSocket message received:", event.data);
            try {
                const data = JSON.parse(event.data);
                console.log("Parsed WebSocket message:", data);

                if (data.message && data.message.text) {
                    const incomingContent = data.message.text;
                    const sender = data.message.sender;
                    const threadId = data.message.threadId;

                    console.log(`Received token: "${incomingContent}" from ${sender}`);

                    setMessages(prevMessages => {
                        const newMessages = [...prevMessages];
                        const lastMessage = newMessages[newMessages.length - 1];

                        if (lastMessage && lastMessage.sender === sender && lastMessage.direction === 'incoming') {
                            // Append to the existing message, preserving line breaks
                            newMessages[newMessages.length - 1] = {
                                ...lastMessage,
                                message: lastMessage.message + incomingContent,
                            };
                        } else {
                            // Create a new message
                            newMessages.push({
                                message: incomingContent,
                                direction: 'incoming',
                                sender: sender,
                                thread_id: threadId,
                            });
                        }

                        return newMessages;
                    });

                    setIsTyping(true);
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
                console.error("Raw event data:", event.data);
            }
        };

        webSocket.current.onerror = (event) => {
            console.error("WebSocket error observed:", event);
            setIsWebSocketConnected(false);
        };

        webSocket.current.onclose = (event) => {
            console.log("WebSocket closed connection:", event);
            setIsWebSocketConnected(false);
            // Retry connection after a delay
            setTimeout(connectWebSocket, 5000);
        };
    }, []);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.isStreaming) {
            // Check if the message seems complete (you might need to adjust this condition)
            if (lastMessage.message.endsWith('.') || lastMessage.message.endsWith('\n')) {
                setMessages(prevMessages => {
                    const newMessages = [...prevMessages];
                    newMessages[newMessages.length - 1] = {
                        ...lastMessage,
                        isStreaming: false
                    };
                    return newMessages;
                });
                setIsTyping(false);
            }
        }
    }, [messages]);

    // WebSocket connection useEffect
    useEffect(() => {
        connectWebSocket();

        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [connectWebSocket]);

    useEffect(() => {
        if (uiContext.screenshot) {
            console.log("New screenshot received in Chat component:", uiContext.screenshot.substring(0, 100) + "...");
            // You can use the screenshot data here, e.g., send it as part of a message
            sendMessage(`Please find updated version of my App UI. Assess it, find potential flaws or improvements and suggest code amendments. Return full code with no omissions`);
        }
    }, [uiContext.screenshot]);


    const sendMessage = async (rawMessage) => {
        const userId = user ? user.id : '';
        const userName = user ? user.username : 'Guest';
        const message = stripHTMLTags(rawMessage);
        const newMessage = {
            message: message,
            direction: 'outgoing',
            sender: userName,
            code: newCode,
            thread_id: threadId,
            user_id: userId,
        };
        console.log('Sending message:', newMessage);
        console.log('Sending user id:', userId);
        console.log('Sending thread id:', threadId);
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsWaiting(true);


        if (webSocket.current.readyState === WebSocket.OPEN) {
            const payload = JSON.stringify({
                message: newMessage.message,
                code: newMessage.code,
                image: uiContext.screenshot,
                threadId: newMessage.thread_id,
                userId: newMessage.user_id,
            });
            console.log('Sending WebSocket payload:', payload);
            webSocket.current.send(payload);
            setMessage("");
        } else {
            console.error('WebSocket is not open. ReadyState:', webSocket.current.readyState);
        }
    };

    const finalizeMessage = useCallback(() => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            if (newMessages.length > 0) {
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.isStreaming) {
                    newMessages[newMessages.length - 1] = {
                        ...lastMessage,
                        isStreaming: false
                    };
                }
            }
            return newMessages;
        });
        setIsTyping(false);
    }, []);


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
        const handleCopyClick = () => {
            try {
                copyToClipboard(code);
                showNotification({
                    message: "Code is copied",
                    variant: "success"
                });
            } catch (error) {
                console.error('Failed to copy code:', error);
                showNotification('Failed to copy code', 'error');
            }
        };

        const handleExecuteClick = () => {
            try {
                runNewCode(code);
                showNotification({
                    message: "Code is sent for execution",
                    variant: "success"
                });

            } catch (error) {
                console.error('Failed to execute code:', error);
                showNotification('Failed to execute code', 'error');
            }
        };

        const handleAddToTerminal = () => {
            try {
                runNewCode(code);
                showNotification({
                    message: "Code added to terminal",
                    variant: "success"
                });
            } catch (error) {
                console.error('Failed to add code:', error);
                showNotification('Failed to add code', 'error');
            }
        };

        const handleDelete = () => {
            showNotification('Code snippet deleted', 'success');
        };

        const userMessageBackgroundColor = '#EDECE4';
        const userMessageTextColor = '#000000';

        return (
            <div style={{
                backgroundColor: '#2B2B2B',
                borderRadius: '5px',
                marginTop: '10px',
                marginBottom: '10px',
                border: '1px solid #464646',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%', // Take full width of parent
                maxWidth: '100%', // Ensure it doesn't exceed parent width
                overflow: 'hidden',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '5px 10px',
                    borderBottom: '1px solid #464646',
                    width: '100%',
                }}>
                    <div style={{
                        backgroundColor: userMessageBackgroundColor,
                        color: userMessageTextColor,
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}>
                        {language.charAt(0).toUpperCase() + language.slice(1)} <FaCode/>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '4px'
                    }}>
                        <Tooltip title="Copy">
                            <IconButton size="small" onClick={handleCopyClick}>
                                <CopyIcon size={16}/>
                            </IconButton>
                        </Tooltip>
                        {language.toLowerCase() === 'python' && (
                            <>
                                <Tooltip title="Add to terminal">
                                    <IconButton size="small" onClick={handleAddToTerminal}>
                                        <TerminalIcon size={16}/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Execute">
                                    <IconButton size="small" onClick={handleExecuteClick}>
                                        <PlayIcon size={16}/>
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        <Tooltip title="Delete">
                            <IconButton size="small" onClick={handleDelete}>
                                <TrashIcon size={16}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div style={{
                    overflowX: 'auto',
                    width: '100%',
                }}>
                    <SyntaxHighlighter
                        language={language}
                        style={darcula}
                        customStyle={{
                            fontSize: '12px',
                            margin: 0,
                            padding: '10px',
                            width: '100%',
                        }}
                    >
                        {code || ' '}
                    </SyntaxHighlighter>
                </div>
            </div>
        );
    };

    const MyMarkdownComponent = (props) => {
        return (
            <ReactMarkdown
                remarkPlugins={[gfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({node, ...props}) => <span {...props} />,
                    pre: ({node, ...props}) => <div {...props} />,
                    code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                            <CodeSnippet
                                language={match[1]}
                                code={String(children).replace(/\n$/, '')}
                                direction={props.direction}
                            />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        )
                    },
                    // Ensure lists are rendered correctly
                    ul: ({node, ...props}) => <ul style={{marginLeft: '20px', listStyleType: 'disc'}} {...props} />,
                    ol: ({node, ...props}) => <ol style={{marginLeft: '20px', listStyleType: 'decimal'}} {...props} />,
                    // Preserve line breaks
                    br: ({node, ...props}) => <br {...props} />,
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

    const MessageBoxWrapper = ({ message, isLastHumanMessage }) => {
        const messageClass = message.direction === 'outgoing' ? 'outgoing' : 'incoming';

        return (
            <div className={`message-box ${messageClass}`}
                 style={{
                     padding: '10px',
                     marginBottom: '10px',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                     maxWidth: '95%', // Limit the width of the message box
                     width: 'fit-content', // Allow the box to shrink to fit content
                     alignSelf: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                     boxSizing: 'border-box',
                 }}
            >
                <div style={{
                    fontSize: '0.9em',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    width: '100%', // Ensure the sender name takes full width
                }}>
                    {message.sender}:
                </div>
                <div style={{
                    width: '100%', // Ensure content takes full width of the message box
                }}>
                    <MyMarkdownComponent markdownText={message.message} direction={message.direction} />
                </div>
                {isLastHumanMessage && isWaiting && (
                    <CircularProgress
                        size={16}
                        style={{
                            marginLeft: '10px',
                            marginTop: '5px'
                        }}
                    />
                )}
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

    const renderMessage = useCallback((message, index) => {
        return (
            <div
                key={index}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: message.direction === 'outgoing' ? 'flex-end' : 'flex-start',
                    paddingLeft: '10px',
                    paddingRight: '10px',
                    boxSizing: 'border-box',
                }}
            >
                <MessageBoxWrapper
                    message={message}
                    isLastHumanMessage={index === messages.length - 1 && message.direction === 'outgoing'}
                />
            </div>
        );
    }, [messages.length]);


    return (
        <div ref={chatRef} className="chat-container">
            <div style={{height: "76.5vh", width: "44vw"}}>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                minWidth: '100%',
                        }}
                            scrollBehavior="smooth"
                        >
                            {messages.map((message, index) => renderMessage(message, index))}
                        </MessageList>

                        <MessageInput
                            placeholder={isWebSocketConnected ? "Type message here" : "Disconnected"}
                            onSend={(value) => sendMessage(value)}
                            style={{
                                color: isWebSocketConnected ? 'black' : 'red',
                            }}
                        />

                        {!isWebSocketConnected && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={connectWebSocket}
                                style={{marginLeft: '10px', marginTop: '10px'}}
                            >
                                Reconnect
                            </Button>
                        )}
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    )
}


export default Chat;