import React, { useEffect, useState } from 'react';
import Message from './Message';
import InputChat from './InputChat';
import WelcomeScreen from '../pages/Welcome';
const { v4: uuidv4 } = require('uuid');
import { PlusCircle, History, LogOut, LayoutGrid, Code } from 'lucide-react';
import { FcFlowChart } from "react-icons/fc";
import { access } from 'fs';

export default function ChatContainer(props: any) {
    const {
        vscode,
        theme,
        user,
        chat,
        setPage,
        token,
        setChat,
    } = props;

    console.log("Container got")
    console.log(props);

    interface MessageType {
        id: string;
        icon: string;
        message: string;
        references: string | null;
    }

    interface ModelType {
        name: string;
        source: string;
    }

    useEffect(() => {
        const handleMessage = (event: any) => {
            const message = event.data;

            switch (message.type) {
                case 'time-complexity':
                    const function_data = message.function;
                    const code = function_data.code;
                    const language = function_data.language;

                    console.log("Code: ");
                    console.log(code);
                    console.log(token);
                    const user_message = "```"+language+"\n"+code+" \n ``` \n Explain the Time complexity and Space Complexity of the above code written in `"+language+"`. Additionally provide scope of improvement.";
                    addMessage({ icon: 'user', message: user_message, model: { name: 'llama3-groq-70b-8192-tool-use-preview', source: 'groq' }, id: uuidv4(), references: null });
            }
        };
                    
        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage)
        };
    }, []);

    const { run_name, llm, chat_history = [], llm_messages = [] } = chat;
    const [messages, setMessages] = useState<MessageType[]>(chat_history);
    const [loading, setLoading] = useState(false);
    const [run_id, setRunId] = useState(chat.run_id == null ? null : chat.run_id);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef(null);
    const [isToolDropdownOpen, setIsToolDropdownOpen] = useState(false);
    const tooldropdownRef = React.useRef(null);

    const handleNewChat = () => {
        setChat({
            run_id: null,
            run_name: '',
            llm: {
                name: 'groq',
                model: 'llama3-groq-70b-8192-tool-use-preview'
            },
            chat_history: [],
        });
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

    const completeChat = async (message: string, model: ModelType, references: string | null) => {

        const typingMessageId = uuidv4();
        
        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: typingMessageId,
                icon: "chatbot",
                message: "Typing...",
                references: null
            }
        ]);

        const _message = message;
        const inference_engine = model.source;
        const model_name = model.name;
        const _run_id = run_id;
        const access_token = token;

        let request_body: any = {};

        request_body = {
            message: _message,
            inference_engine: inference_engine,
            model: model_name,
            access_token: access_token
        }

        if (_run_id != null) {
            request_body['run_id'] = _run_id;
        }

        if (references != null) {
            request_body['input_references'] = references;
        }

        console.log("Request body: ");
        console.log(request_body);

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

            if (data.run_id) {
                setRunId(data.run_id);
            }

            // Remove typing message and add the response
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: data.response,
                    references: null
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
                    references: null
                });
            });
        } finally {
            setLoading(false);
        }
    };

    const addMessage = (newMessage: { icon: string; message: string, model: ModelType, id: string, references: string | null }) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);

        const { icon, message, model, references } = newMessage;
        if (icon === "user") {
            completeChat(message, model, references); // Call completeChat with user message
        }
    };

    return (
        <>
            <div id={run_id} className='flex flex-col h-[85vh] mt-10'>
                <div className='absolute w-full'>
                    <div className='relative' ref={tooldropdownRef}>

                        <button
                            onClick={() => {
                                setIsToolDropdownOpen(!isToolDropdownOpen)
                                setIsDropdownOpen(false)
                            }}
                            className='absolute top-[-32px] right-12 p-1 rounded-full hover:transform hover:scale-105 transition-all'
                        >
                            <div className="w-6 h-6 overflow-hidden">
                                <LayoutGrid className="w-full h-full" />
                            </div>
                        </button>

                        {isToolDropdownOpen && (
                            <div className='absolute right-12 top-2 z-[500] w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                                <div className='py-1'>
                                    <button
                                        onClick={() => setPage('code-convertor')}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    >
                                        <Code className="mr-2 h-4 w-4" />
                                        Code Convertor
                                    </button>
                                    <button
                                        onClick={() => setPage('flowchart')}
                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    >
                                        <FcFlowChart className="mr-2 h-4 w-4" />
                                        Flowcharts
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className='relative' ref={dropdownRef}>

                        <button
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen)
                                setIsToolDropdownOpen(false)
                            }}
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
                            {messages.map((msg, ind) => (

                                <Message
                                    key={msg.id}
                                    vscode={vscode}
                                    icon={msg.icon}
                                    message={msg.message}
                                    theme={theme}
                                    user={user}
                                    animate={msg.message === "Typing..."}
                                    references={msg.references}
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