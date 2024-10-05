"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChatContainer;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Message_1 = __importDefault(require("./Message"));
const InputChat_1 = __importDefault(require("./InputChat"));
const { v4: uuidv4 } = require('uuid');
function ChatContainer(props) {
    const { vscode, theme, user } = props;
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const completeChat = async (message, model) => {
        const typingMessageId = uuidv4();
        setMessages(prevMessages => [
            ...prevMessages,
            {
                id: typingMessageId,
                icon: "chatbot",
                message: "Typing...",
                model: model
            }
        ]);
        setLoading(true);
        try {
            // Replace the URL with your actual FastAPI endpoint
            const response = await fetch('http://localhost:8000/api/v1/chat/completions/ollama', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message, model: model }),
            });
            const data = await response.json();
            // Remove typing message and add the response
            setMessages(prevMessages => {
                return prevMessages.filter(msg => msg.id !== typingMessageId).concat({
                    id: uuidv4(),
                    icon: "chatbot",
                    message: data.content,
                    model: model
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
                    model: model
                });
            });
        }
        finally {
            setLoading(false);
        }
    };
    const addMessage = (newMessage) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
        const { icon, message, model } = newMessage;
        if (icon === "user") {
            completeChat(message, model); // Call completeChat with user message
        }
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { className: 'flex flex-col h-[85vh] mt-5', children: (0, jsx_runtime_1.jsx)("div", { className: 'flex-1 overflow-y-auto pr-4', style: {
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgb(75 85 99) transparent",
                        msOverflowStyle: "none" // for IE/Edge
                    }, children: (0, jsx_runtime_1.jsx)("div", { className: 'space-y-4', children: messages.map((msg) => ((0, jsx_runtime_1.jsx)(Message_1.default, { vscode: vscode, icon: msg.icon, message: msg.message, theme: theme, user: user, model: msg.model, animate: msg.message === "Typing..." }, msg.id))) }) }) }), (0, jsx_runtime_1.jsx)(InputChat_1.default, { vscode: vscode, disabled: loading, addMessage: addMessage, theme: theme })] }));
}
//# sourceMappingURL=ChatContainer.js.map