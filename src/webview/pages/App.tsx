import React, { useEffect, useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import BounceLoader from "react-spinners/BounceLoader";

const vscode = acquireVsCodeApi();

export const App: React.FC = () => {
    const [theme, setTheme] = useState('light');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleMessage = (event: any) => {
            const message = event.data;

            switch (message.type) {
                case 'theme-info':
                    const theme = message.value;
                    setTheme(theme === 1 || theme === 4 ? 'light' : 'dark');
                    break;

                case 'auth-success':
                    setIsAuthenticated(true);
                    setUser(message.user);
                    break;

                case 'auth-status':
                    setIsAuthenticated(message.value);
                    setLoading(false);
                    setUser(message.user);
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
                loading ?
                    <div className='flex flex-col justify-center items-center h-[85vh] mt-5'>
                        <BounceLoader
                            color={theme === 'dark' ? '#fff' : '#000'}
                            size={45}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div> :
                    isAuthenticated ?
                        <ChatContainer vscode={vscode} theme={theme} user={user} />
                        :
                        <Login />
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