import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { MoonLoader } from 'react-spinners';
const { v4: uuidv4 } = require('uuid');
import Mermaid from './Mermaid';


export default function ChatContainer(props: any) {
    const {
        vscode,
        theme,
        user
    } = props;

    interface MessageType {
        id: string;
        icon: string;
        message: any;
    }

    const [messages, setMessages] = useState<MessageType[]>([{
        id: uuidv4(),
        icon: 'chatbot',
        message:{ query: 'Hello, I am Analyz, I can generate flowcharts for you and explain them. Try asking me anything!'},
    }]);

    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');

    const completeChat = async () => {
        try {
            const response = await fetch('http://localhost:8000/assistant/completions/generate-flowchart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();

            const _message: any = {
                icon: 'chatbot',
                message: {
                    flowchart: data.flowchart,
                    explanation: data.explanation
                },
                id: uuidv4()
            }
            addMessage(_message);

        } catch (error) {
            console.error('Error generating flowchart:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = () => {
        setQuery('');
        setLoading(true);

        addMessage({
            icon: 'user',
            message: {
                query: query
            },
            id: uuidv4()
        })
    };

    const addMessage = (newMessage: { icon: string; message: any, id: string }) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);

        const { icon } = newMessage;
        if (icon === "user") {
            completeChat();
        }
    };

    return (
        <>
            <div className='flex flex-col h-[90vh]'>

                <ArrowLeft className="w-6 h-6 dark:text-gray-300 text-gray-900 cursor-pointer absolute right-1 top-1" onClick={() => props.setPage('chat')} />

                {/* Messages area with improved scrollbar */}
                <div
                    className='flex-1 overflow-y-auto pr-4 my-5'
                    style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(75 85 99) transparent",
                        msOverflowStyle: "none"
                    }}
                >
                    {
                        <div className='space-y-4'>
                            {
                                messages.map((message, index) => {
                                    return (
                                        <Message
                                            key={index}
                                            name={message.icon === 'chatbot' ? 'Analyz' : user.name}
                                            message={message.message}
                                            imageSrc={message.icon === 'chatbot' ? '' : user.picture}
                                            theme={theme}
                                            animate={loading && index === messages.length - 1}
                                        />
                                    );
                                })
                            }
                        </div>
                    }
                </div>
            </div>

            <div className="flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto bg-white shadow-lg text-black dark:text-white dark:bg-zinc-800">

                {/* Chat Input */}
                <div className='flex'>
                    <textarea
                        id='chat-input'
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="flex-1 bg-transparent resize-none overflow-y-auto focus:outline-none px-2 custom-scrollbar"
                        placeholder="Ask me anything..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        rows={1} // Initial row
                        style={{ height: 'auto', maxHeight: '200px', scrollbarWidth: "thin", scrollbarColor: "white" }} // Inline height control
                    />

                    <button className="p-1" onClick={handleSubmit}>
                        <Send size={18} className="text-black dark:text-white" />
                    </button>
                </div>
            </div>
        </>
    );
}

export function Message({ name, message, imageSrc, theme, animate }: { message: any, name: string, imageSrc: string, theme: string, animate: boolean }) {
    const loadingTexts = ["Parsing", "Interpreting", "Generating", "Loading"];
    const [loadingText, setLoadingText] = useState("Typing...");

    React.useEffect(() => {
        if (animate) {
            let i = 0;
            const interval = setInterval(() => {
                setLoadingText(`${loadingTexts[i % 4]}...`);
                i++;
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [animate]);

    return (
        <div className="flex flex-col w-full animate-fade-in">
            <div className="flex items-center">
                <div className="flex items-center justify-center">
                    {name === 'Analyz' ? (
                        <Logo />
                    ) : (
                        <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200">
                            <img src={imageSrc} alt="user" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
                <span className="ml-3 font-medium text-sm text-gray-700 dark:text-gray-300">
                    {name === 'Analyz' ? 'Analyz' : name}
                </span>
            </div>

            <div className={`font-normal rounded-md text-black mt-4`}>
                {animate ? (
                    <div className="flex items-center my-5">
                        <MoonLoader
                            color={theme === 'dark' ? '#fff' : '#000'}
                            loading={animate}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        <p className="ml-3 text-gray-500 dark:text-gray-400">{loadingText}</p>
                    </div>
                ) : (
                    <div className={`rounded-md bg-transparent text-black dark:text-white`}>
                        {message.flowchart &&
                            <Mermaid chart={message.flowchart} />
                        }
                        {message.explanation && <p className="">{message.explanation}</p>}
                        {message.query && <p className="">{message.query}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export function Logo() {
    return (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
        </div>
    );
}