
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const { v4: uuidv4 } = require('uuid');
const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
const { vscDarkPlus } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { oneLight } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { Clipboard } = require('lucide-react');

export default function Markdown(props: any) {
    const { theme, vscode, message, height } = props;
    console.log(height)
    const customStyle = theme === 'dark' ? {
        ...vscDarkPlus,
        'pre[class*="language-"]': {
            ...vscDarkPlus['pre[class*="language-"]'],
            padding: '1em',
            margin: '.5em 0',
            height: height ? `${height}` : 'auto'
        },
        'code[class*="language-"]': {
            ...vscDarkPlus['code[class*="language-"]'],
            background: 'transparent',
            tabSize: '4',
            height: height ? `${height}` : 'auto'
        }
    } : {
        ...oneLight,
        'pre[class*="language-"]': {
            ...oneLight['pre[class*="language-"]'],
            padding: '1em',
            margin: '.5em 0',
            height: height ? `${height}` : 'auto'

        },
        'code[class*="language-"]': {
            ...oneLight['code[class*="language-"]'],
            background: 'transparent',
            fontSize: '13px',
            tabSize: '4',
            height: height ? `${height}` : 'auto'
        }
    };

    const handleCopy = (code: any, id: any) => {
        navigator.clipboard.writeText(code)
            .then(() => {
                vscode.postMessage({ type: 'info', message: 'Code copied to clipboard' });
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };

    return (
        <ReactMarkdown
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
                    const id = uuidv4();
                    if (!match) {
                        // This is inline code
                        return (
                            <code
                                {...rest}
                                className="bg-white dark:bg-zinc-800 
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
                                className={`rounded-md text-base]`}
                            >
                                {code}
                            </SyntaxHighlighter>
                            <button
                                onClick={() => handleCopy(code, id)}
                                id={id}
                                className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center"
                            >
                                <Clipboard size={16} />
                            </button>
                        </div>

                    );
                },

            }}
        />
    )
}