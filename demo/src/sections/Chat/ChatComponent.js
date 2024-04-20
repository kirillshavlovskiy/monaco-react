import React, { useEffect, useState, useRef } from "react";
//import ReactMarkdown from 'react-markdown';
function ChatComponent() {
    const [log, setLog] = useState([]);
    const [message, setMessage] = useState("");
    const webSocket = useRef(null);

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

    const sendMessage = () => {
        if (webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(JSON.stringify({message}));
            setLog(log => [...log, `Sent: ${message}`]);
            setMessage("");
        }
    };

    return (
        <div style={{ width: "60bw" }}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>
                Send message
            </button>
            {log.map((message, index) => (
                <div key={index}>
                    {message}
                </div>
            ))}
        </div>
    );
}

export default ChatComponent;