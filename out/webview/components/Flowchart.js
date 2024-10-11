"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatContainer;
exports.Message = Message;
exports.Logo = Logo;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const react_spinners_1 = require("react-spinners");
const { v4: uuidv4 } = require('uuid');
const Mermaid_1 = __importDefault(require("./Mermaid"));
function ChatContainer(props) {
    const { vscode, theme, user } = props;
    const [messages, setMessages] = (0, react_1.useState)([{
            id: uuidv4(),
            icon: 'chatbot',
            message: { query: 'Hello, I am Analyz, I can generate flowcharts for you and explain them. Try asking me anything!' },
        }]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [query, setQuery] = (0, react_1.useState)('');
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
            const _message = {
                icon: 'chatbot',
                message: {
                    flowchart: data.flowchart,
                    explanation: data.explanation
                },
                id: uuidv4()
            };
            addMessage(_message);
        }
        catch (error) {
            console.error('Error generating flowchart:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = () => {
        setQuery('');
        setLoading(true);
        addMessage({
            icon: 'user',
            message: {
                query: query
            },
            id: uuidv4()
        });
    };
    const addMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        const { icon } = newMessage;
        if (icon === "user") {
            completeChat();
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex flex-col h-[90vh]', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-6 h-6 dark:text-gray-300 text-gray-900 cursor-pointer absolute right-1 top-1", onClick: () => props.setPage('chat') }), (0, jsx_runtime_1.jsx)("div", { className: 'flex-1 overflow-y-auto pr-4 my-5', style: {
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgb(75 85 99) transparent",
                            msOverflowStyle: "none"
                        }, children: (0, jsx_runtime_1.jsx)("div", { className: 'space-y-4', children: messages.map((message, index) => {
                                return ((0, jsx_runtime_1.jsx)(Message, { name: message.icon === 'chatbot' ? 'Analyz' : user.name, message: message.message, imageSrc: message.icon === 'chatbot' ? '' : user.picture, theme: theme, animate: loading && index === messages.length - 1 }, index));
                            }) }) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto bg-white shadow-lg text-black dark:text-white dark:bg-zinc-800", children: (0, jsx_runtime_1.jsxs)("div", { className: 'flex', children: [(0, jsx_runtime_1.jsx)("textarea", { id: 'chat-input', value: query, onChange: (e) => {
                                setQuery(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }, className: "flex-1 bg-transparent resize-none overflow-y-auto focus:outline-none px-2 custom-scrollbar", placeholder: "Ask me anything...", onKeyDown: (e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }, rows: 1, style: { height: 'auto', maxHeight: '200px', scrollbarWidth: "thin", scrollbarColor: "white" } }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", onClick: handleSubmit, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { size: 18, className: "text-black dark:text-white" }) })] }) })] }));
}
function Message({ name, message, imageSrc, theme, animate }) {
    const loadingTexts = ["Parsing", "Interpreting", "Generating", "Loading"];
    const [loadingText, setLoadingText] = (0, react_1.useState)("Typing...");
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: name === 'Analyz' ? ((0, jsx_runtime_1.jsx)(Logo, {})) : ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 overflow-hidden rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: imageSrc, alt: "user", className: "w-full h-full object-cover" }) })) }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 font-medium text-sm text-gray-700 dark:text-gray-300", children: name === 'Analyz' ? 'Analyz' : name })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-normal rounded-md text-black mt-4`, children: animate ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center my-5", children: [(0, jsx_runtime_1.jsx)(react_spinners_1.MoonLoader, { color: theme === 'dark' ? '#fff' : '#000', loading: animate, size: 20, "aria-label": "Loading Spinner", "data-testid": "loader" }), (0, jsx_runtime_1.jsx)("p", { className: "ml-3 text-gray-500 dark:text-gray-400", children: loadingText })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: `rounded-md bg-transparent text-black dark:text-white`, children: [message.flowchart &&
                            (0, jsx_runtime_1.jsx)(Mermaid_1.default, { chart: message.flowchart }), message.explanation && (0, jsx_runtime_1.jsx)("p", { className: "", children: message.explanation }), message.query && (0, jsx_runtime_1.jsx)("p", { className: "", children: message.query })] })) })] }));
}
function Logo() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-white rounded-full" }) }) }));
}
//# sourceMappingURL=Flowchart.js.map