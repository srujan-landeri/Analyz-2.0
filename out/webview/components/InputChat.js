"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Chat;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const fa_1 = require("react-icons/fa");
const { v4: uuidv4 } = require('uuid');
function Chat(props) {
    const [inputValue, setInputValue] = (0, react_1.useState)('');
    const [chatDropdown, setChatDropdown] = (0, react_1.useState)(false);
    const [modelDropdown, setModelDropdown] = (0, react_1.useState)(false);
    const models = ['deepseek-coder-v2:16b', 'codestral:22b', 'gemma2:9b', "mistral:latest"];
    const [selectedModel, setSelectedModel] = (0, react_1.useState)('mistral:latest');
    const vscode = props.vscode;
    const disabled = props.disabled;
    const handleSendMessage = () => {
        if (inputValue === '')
            return;
        if (disabled)
            return;
        const newMessage = {
            icon: 'user',
            message: inputValue,
            model: selectedModel,
            id: uuidv4(),
        };
        props.addMessage(newMessage);
        vscode.postMessage({
            type: 'new-message',
            value: inputValue,
        });
        setInputValue('');
        // set the height of the input back to 1 row
        const input = document.getElementById('chat-input');
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
    };
    function handleVoiceInput() {
        vscode.postMessage({
            type: 'alert',
            value: 'Voice input is not supported yet.',
        });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto\r\n                     bg-neutral-50 text-black dark:text-white dark:bg-zinc-800", children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex items-center justify-between mb-2', children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { className: "p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.PlusIcon, { size: 14, className: "text-black dark:text-zinc-300 hover:rotate-45 duration-100", onClick: () => {
                                        setChatDropdown(!chatDropdown);
                                        setModelDropdown(false);
                                    } }) }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", children: modelDropdown ? (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { size: 14, className: "text-black dark:text-zinc-300", onClick: () => {
                                        setChatDropdown(false);
                                        setModelDropdown(!modelDropdown);
                                    } }) : (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { size: 14, className: "text-black dark:text-zinc-300", onClick: () => {
                                        setChatDropdown(false);
                                        setModelDropdown(!modelDropdown);
                                    } }) })] }), (0, jsx_runtime_1.jsxs)("p", { className: 'text-[0.7rem] mr-2 text-black dark:text-zinc-400', children: ["In Use:", (0, jsx_runtime_1.jsx)("span", { className: 'text-[0.8rem] ml-1 text-black dark:text-white', children: selectedModel })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex items-start', children: [(0, jsx_runtime_1.jsx)("textarea", { id: 'chat-input', value: inputValue, onChange: (e) => {
                            setInputValue(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }, className: "flex-1 bg-transparent resize-none overflow-y-auto focus:outline-none px-2 custom-scrollbar", placeholder: "Ask me anything...", onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }, rows: 1, style: { height: 'auto', maxHeight: '200px', scrollbarWidth: "thin", scrollbarColor: "white" } }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", onClick: handleVoiceInput, children: (0, jsx_runtime_1.jsx)(fa_1.FaMicrophone, { size: 18, className: "text-black dark:text-white" }) }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", onClick: handleSendMessage, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { size: 18, className: "text-black dark:text-white" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: `absolute left-0 bottom-20 w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${chatDropdown ? 'block' : 'hidden'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Upload file" })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Image, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Attach image" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: `absolute w-[300px] left-0 bottom-20 w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${modelDropdown ? 'block' : 'hidden'}`, children: [(0, jsx_runtime_1.jsx)("h4", { className: 'text-xs p-2', children: "Choose a model" }), models.map((model, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${selectedModel === model ? 'bg-gray-100 dark:bg-zinc-700' : ''}`, onClick: () => {
                            setSelectedModel(model);
                            setModelDropdown(false);
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.BrainCircuit, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: model })] }, index)))] })] }));
}
//# sourceMappingURL=InputChat.js.map