"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ChatContainer_1 = __importDefault(require("../components/ChatContainer"));
const BounceLoader_1 = __importDefault(require("react-spinners/BounceLoader"));
const History_1 = __importDefault(require("../components/History"));
const CodeConvertor_1 = __importDefault(require("../components/CodeConvertor"));
const Flowchart_1 = __importDefault(require("../components/Flowchart"));
const vscode = acquireVsCodeApi();
const { v4: uuidv4 } = require('uuid');
const App = () => {
    const [theme, setTheme] = (0, react_1.useState)('light');
    const [page, setPage] = (0, react_1.useState)('loader');
    const [user, setUser] = (0, react_1.useState)(null);
    const [tokenData, setTokenData] = (0, react_1.useState)(null);
    const [chat, setChat] = (0, react_1.useState)({
        run_id: null,
        run_name: '',
        llm: {
            name: 'groq',
            model: 'llama3-groq-70b-8192-tool-use-preview'
        },
        chat_history: [],
    });
    (0, react_1.useEffect)(() => {
        const handleMessage = (event) => {
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
                    });
                    setPage('chat');
                    setUser(message.user);
                    setTokenData(message.token);
                    console.log(message.token);
                    break;
                case 'auth-status':
                    if (message.value) {
                        setPage('chat');
                        setUser(message.user);
                        setTokenData(message.token);
                        console.log(message.token);
                    }
                    else {
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: `relative ${theme === 'dark' ? 'dark' : 'light'}`, children: [page == "loading" &&
                (0, jsx_runtime_1.jsx)("div", { className: 'flex flex-col justify-center items-center h-[85vh] mt-5', children: (0, jsx_runtime_1.jsx)(BounceLoader_1.default, { color: theme === 'dark' ? '#fff' : '#000', size: 45, "aria-label": "Loading Spinner", "data-testid": "loader" }) }), page == "chat" && (0, jsx_runtime_1.jsx)(ChatContainer_1.default, { setChat: setChat, token: tokenData, setPage: setPage, chat: chat, vscode: vscode, theme: theme, user: user }), page == "login" && (0, jsx_runtime_1.jsx)(Login, {}), page == "history" && (0, jsx_runtime_1.jsx)(History_1.default, { theme: theme, setPage: setPage, setChat: setChat, token: tokenData }), page == "code-convertor" && (0, jsx_runtime_1.jsx)(CodeConvertor_1.default, { setPage: setPage, theme: theme, vscode: vscode }), page == "flowchart" && (0, jsx_runtime_1.jsx)(Flowchart_1.default, { setPage: setPage, vscode: vscode, theme: theme, user: user })] }));
};
exports.App = App;
function Login() {
    const handleLogin = () => {
        vscode.postMessage({ type: 'initiate-login' });
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: 'flex flex-col gap-10 justify-center items-center h-[85vh]', children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: 'text-4xl text-center font-bold', children: "Welcome to Analyz" }), (0, jsx_runtime_1.jsx)("p", { className: 'text-center text-sm mt-1', children: "Analyz is a code analysis tool that helps you write better code." })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogin, className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", children: "Sign in with Google" })] }));
}
//# sourceMappingURL=App.js.map