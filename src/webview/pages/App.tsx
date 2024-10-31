import React, { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import BounceLoader from "react-spinners/BounceLoader";
import History from '../components/History';
import CodeConvertor from '../components/CodeConvertor';
import Flowchart from '../components/Flowchart';

const vscode = acquireVsCodeApi();
const { v4: uuidv4 } = require('uuid');

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from 'react-icons/fc';

export const App: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [page, setPage] = useState('loading');

    interface LLMType {
        name: string;
        model: string;
    }

    interface MessageType {
        id: string;
        icon: string;
        message: string;
    }

    interface ChatHistory {
        run_id: string | null;
        run_name: string;
        llm: LLMType;
        chat_history: MessageType[];
    }

    const [user, setUser] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [chat, setChat] = useState<ChatHistory>({
        run_id: null,
        run_name: '',
        llm: {
            name: 'groq',
            model: 'llama3-groq-70b-8192-tool-use-preview'
        },
        chat_history: [],
    });

    useEffect(() => {
        const handleMessage = (event: any) => {
            const message = event.data;

            switch (message.type) {
                case 'theme-info':
                    const theme = message.value;
                    setTheme(theme === 1 || theme === 4 ? 'light' : 'dark');
                    break;

                case 'auth-success':
                    setChat({
                        run_id: null,
                        run_name: '',
                        llm: {
                            name: 'groq',
                            model: 'llama3-groq-70b-8192-tool-use-preview'
                        },
                        chat_history: [],
                    })
                    setUser(message.user);
                    setTokenData(message.token);
                    setTimeout(() => {
                        setPage('chat');
                    }, 1000);
                    toast.success("Login Successful!");
                    break;

                case 'auth-status':
                    if (message.value === true) {
                        setUser(message.user);
                        setTokenData(message.token);
                        setTimeout(() => {
                            setPage('chat');
                        }, 1000);
                    } else if (message.value === false) {
                        setPage('login');
                        toast.error("Session Expired! Please login again.");
                    } else {
                        setPage('login');
                        toast.success("Logged out successfully!");
                    }
                    break;
            }
        };

        window.addEventListener('message', handleMessage);

        // Check auth status on mount
        vscode.postMessage({ type: 'check-auth-status' });

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <div className={`relative ${theme === 'dark' ? 'dark' : 'light'}`}>
            {
                page == "loading" &&
                <div className='flex flex-col justify-center items-center h-[85vh] mt-5'>
                    <BounceLoader
                        color={theme === 'dark' ? '#fff' : '#000'}
                        size={45}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            }

            {
                page == "chat" && <ChatContainer setChat={setChat} token={tokenData} setPage={setPage} chat={chat} vscode={vscode} theme={theme} user={user} />
            }

            {
                page == "login" && <Login />
            }

            {
                page == "history" && <History theme={theme} setPage={setPage} setChat={setChat} token={tokenData} />
            }

            {
                page == "code-convertor" && <CodeConvertor setPage={setPage} theme={theme} vscode={vscode} />
            }

            {
                page == "flowchart" && <Flowchart setPage={setPage} vscode={vscode} theme={theme} user={user} />
            }

            <ToastContainer
                position="bottom-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme={theme}
            />
        </div>
    );
};

function Login() {
    const handleLogin = () => {
        vscode.postMessage({ type: 'initiate-login' });
    };

    return (
        <div className='flex flex-col gap-10 justify-center items-center h-[85vh]'>
            <div>
                <h1 className='text-4xl text-center font-bold'>
                    Welcome to Analyz
                </h1>
                <p className='text-center text-sm mt-1'>
                    Analyz is a code analysis tool that helps you write better code.
                </p>
            </div>
            <button
                onClick={handleLogin}
                className="px-4 h-10 w-64 flex items-center justify-center 
                       bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 
                       rounded-md shadow-md hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
                <FcGoogle
                    size={18}
                    className="mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Sign in with Google
                </span>
            </button>
        </div>
    );
}