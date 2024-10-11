"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Markdown;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_markdown_1 = __importDefault(require("react-markdown"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const { v4: uuidv4 } = require('uuid');
const { Prism: SyntaxHighlighter } = require('react-syntax-highlighter');
const { vscDarkPlus } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { oneLight } = require('react-syntax-highlighter/dist/cjs/styles/prism');
const { Clipboard } = require('lucide-react');
function Markdown(props) {
    const { theme, vscode, message, height } = props;
    console.log(height);
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
    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code)
            .then(() => {
            vscode.postMessage({ type: 'info', message: 'Code copied to clipboard' });
        })
            .catch((err) => {
            console.error('Could not copy text: ', err);
        });
    };
    return ((0, jsx_runtime_1.jsx)(react_markdown_1.default, { children: message, remarkPlugins: [remark_gfm_1.default], components: {
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
                const id = uuidv4();
                if (!match) {
                    // This is inline code
                    return ((0, jsx_runtime_1.jsx)("code", { ...rest, className: "bg-white dark:bg-zinc-800 \r\n                                            text-orange-400 dark:text-orange-300 \r\n                                            px-1.5 py-0.5 font-mono", children: children }));
                }
                return ((0, jsx_runtime_1.jsxs)("div", { className: "relative my-4 rounded-md", children: [(0, jsx_runtime_1.jsx)(SyntaxHighlighter, { ...rest, PreTag: "div", language: match[1], style: customStyle, className: `rounded-md text-base]`, children: code }), (0, jsx_runtime_1.jsx)("button", { onClick: () => handleCopy(code, id), id: id, className: "absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-sm px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center", children: (0, jsx_runtime_1.jsx)(Clipboard, { size: 16 }) })] }));
            },
        } }));
}
//# sourceMappingURL=Markdown.js.map