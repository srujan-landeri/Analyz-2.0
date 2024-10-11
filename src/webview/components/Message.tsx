import React, { useState, useEffect } from 'react';
import MoonLoader from "react-spinners/MoonLoader";
import { Globe, Image } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
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

function parseReferencesString(str: any) {
    try {
        // Convert the string to valid JSON format
        console.log("Parsing references string", str);
        str = str.replace(/'/g, '"');
        return JSON.parse(str);
    } catch (error) {
        console.error('Error parsing references string:', error);
        return [];
    }
}

function ReferenceTabs({ referencesString }: any) {
    if (!referencesString) return null;

    const references = parseReferencesString(referencesString);
    console.log("References to be rendered", references);
    if (references.length === 0) return null;

    const getTabs = () => {
        const tabs: any = [];

        Object.keys(references).forEach((key: any) => {
            if (key === 'image') {
                tabs.push({ icon: Image, text: 'Image' });
            } else if (key === 'youtube') {
                const youtubeCount = references[key].length;
                tabs.push({ icon: FaYoutube, text: 'YouTube', count: youtubeCount > 1 ? youtubeCount : null });
            } else if (key === 'websites') {
                const websitesCount = references[key].length;
                tabs.push({
                    icon: Globe,
                    text: 'Websites',
                    count: websitesCount > 1 ? websitesCount : null
                });
            }
        });

        console.log("Tabs to be rendered", tabs);
        return tabs;
    };

    const tabs = getTabs();

    return (
        <div className="flex flex-wrap my-2 items-center justify-between">
            <span className='text-xs font-medium text-gray-700 dark:text-gray-300'>References:</span>
            <div className='flex gap-2'>
                {tabs.map((tab: any, index: any) => {
                    const Icon = tab.icon;
                    return (
                        <div key={index} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-xs mt-1 text-gray-700 dark:text-gray-300">
                            <Icon className="w-4 h-4 mr-1" />
                            <span>{tab.text}</span>
                            {tab.count && <span className="ml-1">({tab.count})</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function Message(props: any) {
    const { icon, theme, vscode, user, animate, message, references } = props;
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
            }, 1000);

            return () => clearInterval(interval);
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
                            <img src={imageSrc} alt="user" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
                <span className="ml-3 font-medium text-sm text-gray-700 dark:text-gray-300">
                    {icon === 'chatbot' ? 'Analyz' : name}
                </span>
            </div>

            <div className={`font-normal rounded-md text-black dark:text-white mt-4`}>
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
                    <>
                        <Markdown
                            vscode={vscode}
                            theme={theme}
                            message={message}
                        />
                        <ReferenceTabs referencesString={references} />
                    </>
                )}
            </div>
        </div>
    );
}