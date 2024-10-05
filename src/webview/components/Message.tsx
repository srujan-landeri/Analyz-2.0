import React, { useState, CSSProperties } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
const { vscDarkPlus } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { oneLight } = require('react-syntax-highlighter/dist/cjs/styles/prism');

const { Clipboard, Check } = require('lucide-react');
import MoonLoader from "react-spinners/MoonLoader";

export function Logo() {
    return (
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
        </div>
    )
}

export default function Message(props: any) {
    const { icon, theme, user, model, animate } = props;

    const imageSrc = user?.picture;
    const name = user?.name;

    const loadingTexts = ["Parsing", "Interpreting", "Generating", "Loading"];

    if(animate) {
        setTimeout(() => {
            let i = 0;
            setInterval(() => {
                document.getElementById("loading-text")!.innerHTML = `${loadingTexts[i % 4]}...`;
                i++;
            }, 1000 * (2 * i + 1));
        }, 1000);
    }

    // Replace ol with ul for better styling
    const message = props.message.replace('ol', 'ul');

    const [copyText, setCopyText] = useState<string | null>(null);
    const customStyle = theme === 'dark' ? {
        ...vscDarkPlus,
        'pre[class*="language-"]': {
            ...vscDarkPlus['pre[class*="language-"]'],
            padding: '1em',
            margin: '.5em 0',
        },
        'code[class*="language-"]': {
            ...vscDarkPlus['code[class*="language-"]'],
            background: 'transparent',
        }
    } : {
        ...oneLight,
        'pre[class*="language-"]': {
            ...oneLight['pre[class*="language-"]'],
            padding: '1em',
            margin: '.5em 0',
        },
        'code[class*="language-"]': {
            ...oneLight['code[class*="language-"]'],
            background: 'transparent',
            fontSize: '13px'
        }
    }

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                setCopyText('Copied!');
                setTimeout(() => setCopyText('Copy'), 2000);
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    return (
        <div className="flex flex-col w-full animate-fade-in">

            <div className="flex items-center mb-2">
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
                {animate ? 
                    <div className="flex items-center my-5">
                        <MoonLoader 
                            color={theme === 'dark' ? '#fff' : '#000'}
                            loading={animate}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                        <p id = "loading-text" className="ml-3 text-gray-500 dark:text-gray-400">Typing...</p>
                    </div>

                    : <ReactMarkdown
                        children={message}
                        remarkPlugins={[remarkGfm]}  // Use remark-gfm plugin
                        components={{
                            // Add list styling
                            ul: ({ children }) => (
                                <ul className="list-disc pl-6 space-y-3 my-4">{children}</ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="space-y-3 my-4">{children}</ol>
                            ),
                            li: ({ children }) => (
                                <li className="my-2">{children}</li>
                            ),
                            // Add link styling
                            a: ({ href, children }) => (
                                <a href={href} className="text-blue-500 hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                                    {children}
                                </a>
                            ),
                            table: ({ children }) => (
                                <table className="table-auto my-4 border-collapse border border-gray-500">
                                    {children}
                                </table>
                            ),
                            th: ({ children }) => (
                                <th className="border border-gray-500 px-4 py-2">{children}</th>
                            ),
                            td: ({ children }) => (
                                <td className="border border-gray-500 px-4 py-2">{children}</td>
                            ),
                            // Modify code component to handle both inline and block code
                            code(props) {
                                const { children, className, ...rest } = props;
                                const match = /language-(\w+)/.exec(className || '');
                                const code = String(children).replace(/\n$/, '');

                                if (!match) {
                                    // This is inline code
                                    return (
                                        <code
                                            {...rest}
                                            className="bg-white dark:bg-zinc-500 
                                            text-orange-400 dark:text-orange-300 
                                            px-1.5 py-0.5 font-mono"
                                        >
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <div className="relative my-4 rounded-md">
                                        <SyntaxHighlighter
                                            {...rest}
                                            PreTag="div"
                                            language={match[1]}
                                            style={customStyle}
                                            className="rounded-md text-base"
                                        >
                                            {code}
                                        </SyntaxHighlighter>
                                        <button
                                            onClick={() => handleCopy(code)}
                                            className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center"
                                        >
                                            {copyText === 'Copied!' ? (
                                                <Check size={16} className="" />
                                            ) : (
                                                <Clipboard size={16} className="" />
                                            )}
                                        </button>
                                    </div>
                                );
                            },

                        }}
                    />}
            </div>

            {icon == "chatbot" ?
                <p className='text-[0.7rem] mt-2 text-gray-500 dark:text-gray-400 text-right'>
                    Generated By: <span className="font-semibold text-[0.8rem] text-gray-700 dark:text-gray-300">
                        {model}
                    </span>
                </p> :
                null
            }
        </div>
    );
}