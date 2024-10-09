import React, { useState, useEffect } from 'react';
import MoonLoader from "react-spinners/MoonLoader";
import Markdown from './Markdown';

export function Logo() {
    return (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
        </div>
    );
}

export default function Message(props: any) {
    const { icon, theme, vscode, user, animate, message } = props;
    const [loadingText, setLoadingText] = useState("Typing...");
    const imageSrc = user?.picture;
    const name = user?.name;

    const loadingTexts = ["Parsing", "Interpreting", "Generating", "Loading"];

    useEffect(() => {
        if (animate) {
            let i = 0;
            const interval = setInterval(() => {
                setLoadingText(`${loadingTexts[i % 4]}...`);
                i++;
            }, 1000); // Update every second

            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [animate]);

    return (
        <div className="flex flex-col w-full animate-fade-in">
            <div className="flex items-center">
                <div className="flex items-center justify-center">
                    {icon === 'chatbot' ? (
                        <Logo />
                    ) : (
                        <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-200">
                            <img src={imageSrc} alt="user" className='w-full h-full object-cover' />
                        </div>
                    )}
                </div>
                <span className='ml-3 font-medium text-sm text-gray-700 dark:text-gray-300'>
                    {icon === 'chatbot' ? 'Analyz' : name}
                </span>
            </div>

            <div className={`font-normal rounded-md text-black dark:text-white apply-my-2`}>
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
                    <Markdown
                        vscode={vscode}
                        theme={theme}
                        message={message}
                    />
                )}
            </div>
        </div>
    );
}
