"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatContainer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const Message_1 = __importDefault(require("./Message"));
const InputChat_1 = __importDefault(require("./InputChat"));
const Welcome_1 = __importDefault(require("../pages/Welcome"));
const { v4: uuidv4 } = require('uuid');
const lucide_react_1 = require("lucide-react");
const fc_1 = require("react-icons/fc");
function ChatContainer(props) {
    const { vscode, theme, user, chat, setPage, token, setChat } = props;
    console.log("Container got");
    console.log(chat);
    const { run_name, llm, chat_history = [], llm_messages = [] } = chat;
    const [messages, setMessages] = (0, react_1.useState)(chat_history);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [run_id, setRunId] = (0, react_1.useState)(props.run_id == null ? null : props.run_id);
    const [isDropdownOpen, setIsDropdownOpen] = (0, react_1.useState)(false);
    const dropdownRef = react_1.default.useRef(null);
    const [isToolDropdownOpen, setIsToolDropdownOpen] = (0, react_1.useState)(false);
    const tooldropdownRef = react_1.default.useRef(null);
    const handleNewChat = () => {
        setChat({
            run_id: null,
            run_name: '',
            llm: {
                name: 'mistral:latest',
                model: 'ollama'
            },
            chat_history: []
        });
        setMessages([]);
        setPage('chat');
        setIsDropdownOpen(false);
    };
    const handleChatHistory = () => {
        setPage('history');
    };
    const handleLogout = () => {
        vscode.postMessage({ type: 'logout' });
    };
    const completeChat = async (message, model, references) => {
        const typingMessageId = uuidv4();
        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: typingMessageId,
                icon: "chatbot",
                message: "Typing...",
                references: null
            }
        ]);
        const _message = message;
        const inference_engine = model.source;
        const model_name = model.name;
        const _run_id = run_id;
        const access_token = token;
        let request_body = {};
        request_body = {
            message: _message,
            inference_engine: inference_engine,
            model: model_name,
            access_token: access_token
        };
        if (_run_id != null) {
            request_body['run_id'] = _run_id;
        }
        if (references != null) {
            request_body['input_references'] = references;
        }
        console.log("Request body: ");
        console.log(request_body);
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/assistant/completions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request_body),
            });
            const data = await response.json();
            console.log("Chatbot response: ", data);
            if (data.run_id) {
                setRunId(data.run_id);
            }
            // Remove typing message and add the response
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: data.response,
                    references: null
                });
            });
        }
        catch (error) {
            console.error('Error fetching chat completion:', error);
            // Remove typing message and add an error message
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: "Sorry, I couldn't get a response.",
                    references: null
                });
            });
        }
        finally {
            setLoading(false);
        }
    };
    const addMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        const { icon, message, model, references } = newMessage;
        if (icon === "user") {
            completeChat(message, model, references); // Call completeChat with user message
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { id: run_id, className: 'flex flex-col h-[85vh] mt-10', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'absolute w-full', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'relative', ref: tooldropdownRef, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsToolDropdownOpen(!isToolDropdownOpen), className: 'absolute top-[-32px] right-12 p-1 rounded-full hover:transform hover:scale-105 transition-all', children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 overflow-hidden", children: (0, jsx_runtime_1.jsx)(lucide_react_1.LayoutGrid, { className: "w-full h-full" }) }) }), isToolDropdownOpen && ((0, jsx_runtime_1.jsx)("div", { className: 'absolute right-12 top-2 z-[500] w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none', children: (0, jsx_runtime_1.jsxs)("div", { className: 'py-1', children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setPage('code-convertor'), className: 'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Code, { className: "mr-2 h-4 w-4" }), "Code Convertor"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setPage('flowcharts'), className: 'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700', children: [(0, jsx_runtime_1.jsx)(fc_1.FcFlowChart, { className: "mr-2 h-4 w-4" }), "Flowcharts"] })] }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: 'relative', ref: dropdownRef, children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsDropdownOpen(!isDropdownOpen), className: 'absolute top-[-35px] right-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors', children: (0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 overflow-hidden rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: user?.picture, alt: "user", className: 'w-full h-full object-cover' }) }) }), isDropdownOpen && ((0, jsx_runtime_1.jsx)("div", { className: 'absolute right-0 top-2 z-[500] w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none', children: (0, jsx_runtime_1.jsxs)("div", { className: 'py-1', children: [(0, jsx_runtime_1.jsxs)("button", { onClick: handleLogout, className: 'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { className: "mr-2 h-4 w-4" }), "Logout"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleNewChat, className: 'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.PlusCircle, { className: "mr-2 h-4 w-4" }), "New Chat"] }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleChatHistory, className: 'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.History, { className: "mr-2 h-4 w-4" }), "Chat History"] })] }) }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: 'flex-1 overflow-y-auto pr-4 my-5', style: {
                            scrollbarWidth: "thin",
                            scrollbarColor: "rgb(75 85 99) transparent",
                            msOverflowStyle: "none" // for IE/Edge
                        }, children: messages.length > 0 ?
                            (0, jsx_runtime_1.jsx)("div", { className: 'space-y-4', children: messages.map((msg, ind) => ((0, jsx_runtime_1.jsx)(Message_1.default, { vscode: vscode, icon: msg.icon, message: msg.message, theme: theme, user: user, animate: msg.message === "Typing...", references: msg.references }, msg.id))) }) : (0, jsx_runtime_1.jsx)(Welcome_1.default, {}) })] }), (0, jsx_runtime_1.jsx)(InputChat_1.default, { vscode: vscode, disabled: loading, addMessage: addMessage, theme: theme, llm: llm })] }));
}
//# sourceMappingURL=ChatContainer.js.map