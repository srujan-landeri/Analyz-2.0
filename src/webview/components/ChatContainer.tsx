import React, { useState } from 'react';
import Message from './Message';
import InputChat from './InputChat';
import WelcomeScreen from '../pages/Welcome';
const { v4: uuidv4 } = require('uuid');
import { EllipsisVertical, PlusCircle, History, LogOut } from 'lucide-react';

export default function ChatContainer(props: any) {
    const {
        vscode,
        theme,
        user,
        chat,
        setPage,
        token,
        setChat
    } = props;

    console.log("Container got")
    console.log(chat);

    interface MessageType {
        id: string;
        icon: string;
        message: string;
    }

    interface ModelType {
        name: string;
        source: string;
    }

    const { run_name, llm, chat_history = [] } = chat;
    const [messages, setMessages] = useState<MessageType[]>(chat_history);
    const [loading, setLoading] = useState(false);
    const [run_id, setRunId] = useState(props.run_id == null ? null : props.run_id);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);

    const handleNewChat = () => {
        setChat({
            run_id: null,
            run_name: '',
            llm: {
                name: 'mistral:latest',
                model: 'ollama'
            },
            chat_history: []
        })
        setMessages([])
        setPage('chat');
        setIsDropdownOpen(false);
    };

    const handleChatHistory = () => {
        setPage('history');
    };

    const handleLogout = () => {
        vscode.postMessage({ type: 'logout' });
    }

    const completeChat = async (message: string, model: ModelType) => {

        const typingMessageId = uuidv4();

        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: typingMessageId,
                icon: "chatbot",
                message: "Typing...",
            }
        ]);

        const _message = message;
        const inference_engine = model.source;
        const model_name = model.name;
        const _run_id = run_id;
        const access_token = token;

        let request_body = {};

        if (_run_id == null) {
            request_body = {
                message: _message,
                inference_engine: inference_engine,
                model: model_name,
                access_token: access_token
            }
        } else {
            request_body = {
                message: _message,
                inference_engine: inference_engine,
                model: model_name,
                run_id: _run_id,
                access_token: access_token
            }
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/assistant/completions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request_body),
            });

            const data = await response.json();
            console.log("Chatbot response: ", data);

            if (data.run_id) {
                setRunId(data.run_id);
            }

            // Remove typing message and add the response
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: data.response,
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
            <div id={run_id} className='flex flex-col h-[85vh] mt-10'>
                <div className='absolute w-full'>
                    <div className='relative' ref={dropdownRef}>


                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='absolute top-[-35px] right-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                        >
                            <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200">
                                <img src={user?.picture} alt="user" className='w-full h-full object-cover' />
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className='absolute right-0 top-2 z-[500] w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <div className='py-1'>
                                    <button
                                        onClick={handleLogout}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Logout
                                    </button>
                                    <button
                                        onClick={handleNewChat}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    >
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        New Chat
                                    </button>
                                    <button
                                        onClick={handleChatHistory}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    >
                                        <History className="mr-2 h-4 w-4" />
                                        Chat History
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messages area with improved scrollbar */}
                <div
                    className='flex-1 overflow-y-auto pr-4 my-5'
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(75 85 99) transparent",
                        msOverflowStyle: "none"  // for IE/Edge
                    }}
                >
                    {messages.length > 0 ?
                        <div className='space-y-4'>
                            {messages.map((msg) => (

                                <Message
                                    key={msg.id}
                                    vscode={vscode}
                                    icon={msg.icon}
                                    message={msg.message}
                                    theme={theme}
                                    user={user}
                                    animate={msg.message === "Typing..."}
                                />

                            ))}
                        </div> : <WelcomeScreen />
                    }
                </div>
            </div>
            <InputChat vscode={vscode} disabled={loading} addMessage={addMessage} theme={theme} llm={llm} />
        </>
    );
}