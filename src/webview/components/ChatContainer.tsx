import React, { useState } from 'react';
import Message from './Message';
import InputChat from './InputChat';
import WelcomeScreen from '../pages/Welcome';
const { v4: uuidv4 } = require('uuid');

export default function ChatContainer(props: any) {
    const { vscode, theme, user } = props;
    interface MessageType {
        id: string;
        icon: string;
        message: string;
        model: ModelType;
    }

    interface ModelType{
        name: string;
        source: string;
    }

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [loading, setLoading] = useState(false);


    const completeChat = async (message: string, model: ModelType) => {

        const typingMessageId = uuidv4();

        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: typingMessageId,
                icon: "chatbot",
                message: "Typing...",
                model: model
            }
        ]);

        setLoading(true);

        try {
            // Replace the URL with your actual FastAPI endpoint
            const response = await fetch('http://localhost:8000/api/v1/chat/completions/ollama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message, model: model.name }),
            });

            const data = await response.json();

            // Remove typing message and add the response
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: data.content,
                    model: model
                });
            });
        } catch (error) {
            console.error('Error fetching chat completion:', error);
            // Remove typing message and add an error message
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: "Sorry, I couldn't get a response.",
                    model: model
                });
            });
        } finally {
            setLoading(false);
        }
    };

    const addMessage = (newMessage: { icon: string; message: string, model: ModelType, id: string }) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);

        const { icon, message, model } = newMessage;
        if (icon === "user") {
            completeChat(message, model); // Call completeChat with user message
        }
    };

    return (
        <>
            <div className='flex flex-col h-[85vh] mt-5'>
                {/* Messages area with improved scrollbar */}
                <div
                    className='flex-1 overflow-y-auto pr-4'
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(75 85 99) transparent",
                        msOverflowStyle: "none"  // for IE/Edge
                    }}
                >
                    { messages.length > 0 ?
                        <div className='space-y-4'>
                        {messages.map((msg) => (

                            <Message
                                key={msg.id}
                                vscode={vscode}
                                icon={msg.icon}
                                message={msg.message}
                                theme={theme}
                                user={user}
                                model={msg.model.name}
                                animate={msg.message === "Typing..."}
                            />

                        ))}
                        </div> : <WelcomeScreen/>
                    }
                </div>
            </div>
            <InputChat vscode={vscode} disabled={loading} addMessage={addMessage} theme={theme} />
        </>
    );
}
