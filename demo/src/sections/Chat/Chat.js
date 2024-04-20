import './styles.css'; // Import the CSS file
import React, {useState, useRef, useEffect} from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import {useStore} from "../../store";
import {useTheme} from "@mui/material/styles";
import useStyles from "../Editor/useStyles";
import ReactMarkdown from 'react-markdown';



function Chat() {
    const classes = useStyles();
    const theme = useTheme();
    const chatRef = useRef(null);
    const [log, setLog] = useState([]);
    const [message, setMessage] = useState("");
    const webSocket = useRef(null);
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm Autogen Agent! I can help you with your Python coding!",
            sentTime: "just now",
                sender: "ChatGPT"
        }
    ]);
    const {
        state: {
            editor: {selectedLanguageId, options},
            monacoTheme,
            themeBackground,
            fontColor,
            isSettingsVisible,
            isSideBarVisible
        },
        actions: setThemeBackground
    } = useStore();
    const [isTyping, setIsTyping] = useState(false);

    const sendMessage = async (message) => {
        const newMessage = {
            message,
            direction: 'incoming',
            sender: 'Server'

        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setIsTyping(true);
        if (webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({message}));
            setLog(log => [...log, `Sent: ${message}`]);
            setMessage("");
        }

        // If you have the processMessageToChatGPT function implemented
        // await processMessageToChatGPT(newMessages);
    };

    useEffect(() => {
        webSocket.current = new WebSocket("ws://localhost:8000/ws/livechat_autogen/");

        webSocket.current.onopen = () => {
            console.log("WebSocket open");
        };

        webSocket.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const message = data.message;
                setLog(log => [...log, `Received: ${message}`]);
                setMessages(messages => [...messages, {message, direction: 'incoming', sender: 'Server'}])
            } catch (error) {
                console.error("Error parsing server response: ", error);
            }
        };

        webSocket.current.onerror = (event) => {
            console.error("WebSocket error observed:", event);
        };

        webSocket.current.onclose = (event) => {
            console.log("WebSocket closed connection:", event);
        };

        return () => {
            webSocket.current.close();
        };
    }, []);


        useEffect(() => {
            if (chatRef.current) {
                const themeBkgd = themeBackground;
                const themeClr = theme.palette.primary.main
                const textColor = theme.palette.text.primary;
                chatRef.current.style.setProperty('--theme-color', themeClr);
                chatRef.current.style.setProperty('--background-color', themeBkgd);
                chatRef.current.style.setProperty('--text-color', textColor);

            } else {
                console.error('chatRef.current is not defined');
            }
        }, [themeBackground, theme]);

        return (
            <div ref={chatRef} className="chat-container">
                <div style={{height: "76.5vh", width: "41.5vw"}}>
                    <MainContainer>
                        <ChatContainer>
                            <MessageList
                                scrollBehavior="smooth"
                                typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing"/> : null}
                            >
                                {messages.map((message, i) => {
                                    console.log(message)
                                    return <Message key={i} model={message}/>
                                })}
                            </MessageList>
                            <MessageInput placeholder="Type message here" onSend={(value) => sendMessage(value)}/>
                        </ChatContainer>
                    </MainContainer>
                </div>
            </div>
        )
    }


export default Chat