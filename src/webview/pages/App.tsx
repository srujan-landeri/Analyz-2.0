import React, { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import BounceLoader from "react-spinners/BounceLoader";
import History from '../components/History';
import CodeConvertor from '../components/CodeConvertor';
import Flowchart from '../components/Flowchart';

const vscode = acquireVsCodeApi();
const { v4: uuidv4 } = require('uuid');

export const App: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [page, setPage] = useState('loader');

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
                    setPage('chat');
                    setUser(message.user);
                    setTokenData(message.token);
                    console.log(message.token)
                    break;

                case 'auth-status':
                    if (message.value) {
                        setPage('chat');
                        setUser(message.user);
                        setTokenData(message.token);
                        console.log(message.token)
                    } else {
                        setPage('login');
                    }
                    break;
            }
        };

        window.addEventListener('message', handleMessage);

        // Check auth status on mount

        //! Uncomment this line
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
                page == "chat" && <ChatContainer setChat={setChat} token = {tokenData} setPage={setPage} chat={chat} vscode={vscode} theme={theme} user={user} />
            }

            {
                page == "login" && <Login />
            }

            {
                page == "history" && <History theme={theme} setPage={setPage} setChat={setChat} token = {tokenData}/>
            }

            {
                page == "code-convertor" && <CodeConvertor setPage={setPage} theme={theme} vscode={vscode} />
            }

            {
                page == "flowchart" && <Flowchart setPage = {setPage} vscode={vscode} theme={theme} user={user} />
            }
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Sign in with Google
            </button>
        </div>
    );
}