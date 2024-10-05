"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Message;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_markdown_1 = __importDefault(require("react-markdown"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
const { vscDarkPlus } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { Clipboard, Check } = require('lucide-react');
function Message(props) {
    const { icon, theme, user, model } = props;
    console.log(Object.entries(vscDarkPlus));
    const botImage = "https://cdn-icons-png.flaticon.com/512/8943/8943377.png";
    const imageSrc = user?.picture;
    const name = user?.name;
    // Replace ol with ul for better styling
    const message = props.message.replace('ol', 'ul');
    console.log(message);
    const [copyText, setCopyText] = (0, react_1.useState)(null);
    const customStyle = {
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
    };
    const handleCopy = (code) => {
        navigator.clipboard.writeText(code)
            .then(() => {
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        })
            .catch((err) => {
            console.error('Could not copy text: ', err);
        });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: icon === 'chatbot' ? ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("img", { src: botImage, alt: "chatbot", className: 'w-6 h-6' }) })) : ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 overflow-hidden rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: imageSrc, alt: "user", className: 'w-full h-full object-cover' }) })) }), (0, jsx_runtime_1.jsx)("span", { className: 'ml-3 font-medium text-sm text-gray-700 dark:text-gray-300', children: icon === 'chatbot' ? 'Analyz' : name })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-normal rounded-md text-black dark:text-white`, children: (0, jsx_runtime_1.jsx)(react_markdown_1.default, { children: message, remarkPlugins: [remark_gfm_1.default], components: {
                        // Add list styling
                        ul: ({ children }) => ((0, jsx_runtime_1.jsx)("ul", { className: "list-disc pl-6 space-y-3 my-4", children: children })),
                        ol: ({ children }) => ((0, jsx_runtime_1.jsx)("ol", { className: "space-y-3 my-4", children: children })),
                        li: ({ children }) => ((0, jsx_runtime_1.jsx)("li", { className: "my-2", children: children })),
                        // Add link styling
                        a: ({ href, children }) => ((0, jsx_runtime_1.jsx)("a", { href: href, className: "text-blue-500 hover:text-blue-600 underline", target: "_blank", rel: "noopener noreferrer", children: children })),
                        table: ({ children }) => ((0, jsx_runtime_1.jsx)("table", { className: "table-auto my-4 border-collapse border border-gray-500", children: children })),
                        th: ({ children }) => ((0, jsx_runtime_1.jsx)("th", { className: "border border-gray-500 px-4 py-2", children: children })),
                        td: ({ children }) => ((0, jsx_runtime_1.jsx)("td", { className: "border border-gray-500 px-4 py-2", children: children })),
                        // Modify code component to handle both inline and block code
                        code(props) {
                            const { children, className, ...rest } = props;
                            const match = /language-(\w+)/.exec(className || '');
                            const code = String(children).replace(/\n$/, '');
                            if (!match) {
                                // This is inline code
                                return ((0, jsx_runtime_1.jsx)("code", { ...rest, className: "bg-zinc-800 text-orange-400 px-1.5 py-0.5 font-mono text-xs", children: children }));
                            }
                            return ((0, jsx_runtime_1.jsxs)("div", { className: "relative my-4 rounded-md", children: [(0, jsx_runtime_1.jsx)(SyntaxHighlighter, { ...rest, PreTag: "div", language: match[1], style: customStyle, className: "rounded-md", children: code }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleCopy(code), className: "absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center", children: copyText === 'Copied!' ? ((0, jsx_runtime_1.jsx)(Check, { size: 16, className: "" })) : ((0, jsx_runtime_1.jsx)(Clipboard, { size: 16, className: "" })) })] }));
                        },
                    } }) }), icon == "chatbot" ?
                (0, jsx_runtime_1.jsxs)("p", { className: 'text-[0.7rem] mt-2 text-gray-500 dark:text-gray-400 text-right', children: ["Generated By: ", (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-[0.8rem] text-white", children: model })] }) :
                (0, jsx_runtime_1.jsx)("p", { className: 'text-[0.7rem] mt-2 text-gray-500 dark:text-gray-400 text-right', children: "\u00A0" })] }));
}
//# sourceMappingURL=Message.js.map