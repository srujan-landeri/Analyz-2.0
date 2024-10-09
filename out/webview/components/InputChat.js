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
    const modelsMap = {
        ollama: [{ icon: 'text', model: 'deepseek-coder-v2:16b' }, { icon: 'text', model: 'codestral:22b' }, { icon: 'text', model: 'gemma2:9b' }, { icon: 'text', model: 'mistral:latest' }],
        groq: [{ icon: 'text', model: 'llama3-groq-70b-8192-tool-use-preview' }, { icon: 'text', model: 'llama-3.1-70b-versatile' }, { icon: 'image', model: 'llama-3.2-11b-vision-preview' }],
    };
    const [selectedSource, setSelectedSource] = (0, react_1.useState)(props.llm.name);
    const [selectedModel, setSelectedModel] = (0, react_1.useState)(props.llm.model);
    const [openKey, setOpenKey] = (0, react_1.useState)(null); // State for the open accordion
    const [pastedImage, setPastedImage] = (0, react_1.useState)(null); // State for pasted image
    // Add these to your existing state declarations
    const [fileModal, setFileModal] = (0, react_1.useState)(false);
    const [websiteModal, setWebsiteModal] = (0, react_1.useState)(false);
    const [youtubeModal, setYoutubeModal] = (0, react_1.useState)(false);
    const [webSearchEnabled, setWebSearchEnabled] = (0, react_1.useState)(false);
    // Add these to your existing state declarations
    const [uploadedFile, setUploadedFile] = (0, react_1.useState)(null);
    const [websites, setWebsites] = (0, react_1.useState)([]);
    const [youtubeUrls, setYoutubeUrls] = (0, react_1.useState)([]);
    const vscode = props.vscode;
    const disabled = props.disabled;
    const handleToggle = (key) => {
        setSelectedSource(key);
        setOpenKey(openKey === key ? null : key);
    };
    const handleSendMessage = () => {
        if (inputValue === '')
            return;
        if (disabled)
            return;
        const newMessage = {
            icon: 'user',
            message: inputValue,
            model: {
                name: selectedModel,
                source: selectedSource,
            },
            id: uuidv4(),
        };
        props.addMessage(newMessage);
        setInputValue('');
        const input = document.getElementById('chat-input');
        input.style.height = `30px`;
    };
    function handleVoiceInput() {
        vscode.postMessage({
            type: 'alert',
            value: 'Voice input is not supported yet.',
        });
    }
    // Modal Component
    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen)
            return null;
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white dark:bg-zinc-800 rounded-lg p-4 w-96", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center mb-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "p-1", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 18, className: "text-gray-500 dark:text-gray-400" }) })] }), children] }) }));
    };
    const ResourceChip = ({ icon: Icon, label, count, onRemove }) => ((0, jsx_runtime_1.jsx)("div", { className: "relative flex items-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md", children: [(0, jsx_runtime_1.jsx)(Icon, { size: 14, className: "text-black dark:text-zinc-300 mr-1" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-600 dark:text-zinc-400", children: [label, " ", count && count > 1 && `(${count})`] }), (0, jsx_runtime_1.jsx)("button", { className: "ml-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full p-1 transition-all", onClick: onRemove, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 12, className: "text-gray-500 dark:text-zinc-400" }) })] }) }));
    const handlePaste = (e) => {
        const items = e.clipboardData.items;
        // Loop through clipboard items
        console.log(items);
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        if (event.target && typeof event.target.result === 'string') {
                            setPastedImage(event.target.result); // Set the pasted image as base64
                        }
                    };
                    reader.readAsDataURL(file); // Read the image file as a data URL
                }
                break; // Only allow one image to be pasted
            }
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto bg-white shadow-lg text-black dark:text-white dark:bg-zinc-800", children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex items-center justify-between mb-2', children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-2', children: [(0, jsx_runtime_1.jsx)("div", { className: 'flex items-center space-x-2', children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("button", { className: "p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all", onClick: () => {
                                                setChatDropdown(!chatDropdown);
                                                setModelDropdown(false);
                                            }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.PlusIcon, { size: 14, className: "text-black dark:text-zinc-300 hover:rotate-45 transition-transform duration-200" }) }), (0, jsx_runtime_1.jsx)("button", { className: "p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all", onClick: () => {
                                                setChatDropdown(false);
                                                setModelDropdown(!modelDropdown);
                                            }, children: modelDropdown ? ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronDown, { size: 14, className: "text-black dark:text-zinc-300" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChevronUp, { size: 14, className: "text-black dark:text-zinc-300" })) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [pastedImage && ((0, jsx_runtime_1.jsx)(ResourceChip, { icon: lucide_react_1.ImageIcon, label: "Image", onRemove: () => setPastedImage(null) })), uploadedFile && ((0, jsx_runtime_1.jsx)(ResourceChip, { icon: lucide_react_1.Upload, label: "File", onRemove: () => setUploadedFile(null) })), websites.length > 0 && ((0, jsx_runtime_1.jsx)(ResourceChip, { icon: lucide_react_1.Globe, label: "Websites", count: websites.length, onRemove: () => setWebsites([]) })), youtubeUrls.length > 0 && ((0, jsx_runtime_1.jsx)(ResourceChip, { icon: fa_1.FaYoutube, label: "YouTube", count: youtubeUrls.length, onRemove: () => setYoutubeUrls([]) })), webSearchEnabled && ((0, jsx_runtime_1.jsx)(ResourceChip, { icon: lucide_react_1.Search, label: "Web Search", onRemove: () => setWebSearchEnabled(false) }))] })] }), (0, jsx_runtime_1.jsx)("div", { className: 'flex items-center', children: (0, jsx_runtime_1.jsxs)("p", { className: 'text-xs text-gray-500 dark:text-gray-400', children: ["In Use", ' ', (0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-gray-700 dark:text-gray-300", children: [selectedSource, " : ", selectedModel] })] }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex items-start', children: [(0, jsx_runtime_1.jsx)("textarea", { id: 'chat-input', value: inputValue, onChange: (e) => {
                            setInputValue(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }, className: "flex-1 bg-transparent resize-none overflow-y-auto focus:outline-none px-2 custom-scrollbar", placeholder: "Ask me anything...", onKeyDown: (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }, onPaste: handlePaste, rows: 1, style: { height: 'auto', maxHeight: '200px', scrollbarWidth: "thin", scrollbarColor: "white" } }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", onClick: handleVoiceInput, children: (0, jsx_runtime_1.jsx)(fa_1.FaMicrophone, { size: 18, className: "text-black dark:text-white" }) }), (0, jsx_runtime_1.jsx)("button", { className: "p-1", onClick: handleSendMessage, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Send, { size: 18, className: "text-black dark:text-white" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: `absolute left-0 bottom-20 w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${chatDropdown ? 'block' : 'hidden'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', onClick: () => {
                            setFileModal(true);
                            setChatDropdown(false);
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Upload file" })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', onClick: () => {
                            setWebsiteModal(true);
                            setChatDropdown(false);
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Scrape Website" })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', onClick: () => {
                            setYoutubeModal(true);
                            setChatDropdown(false);
                        }, children: [(0, jsx_runtime_1.jsx)(fa_1.FaYoutube, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Youtube URL" })] }), (0, jsx_runtime_1.jsxs)("div", { className: 'flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700', onClick: () => {
                            setWebSearchEnabled(!webSearchEnabled);
                            setChatDropdown(false);
                        }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { size: 18, className: 'text-black dark:text-white' }), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: "Allow Web Search" })] })] }), (0, jsx_runtime_1.jsx)(Modal, { isOpen: fileModal, onClose: () => setFileModal(false), title: "Upload File", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative flex items-center w-full", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", onChange: (e) => {
                                if (e.target.files?.[0]) {
                                    setUploadedFile(e.target.files[0]);
                                    setFileModal(false);
                                }
                            }, className: "sr-only", id: "file-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "file-upload", className: "flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-zinc-700 rounded-md cursor-pointer border border-gray-200 dark:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-sm text-gray-500 dark:text-gray-400 flex-grow text-center", children: uploadedFile ? uploadedFile.name : "No file chosen" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { size: 18, className: "text-gray-500 dark:text-gray-400 ml-2" })] })] }) }), (0, jsx_runtime_1.jsx)(Modal, { isOpen: websiteModal, onClose: () => setWebsiteModal(false), title: "Add Website URL", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter website URL", className: "w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600", onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            setWebsites([...websites, e.target.value]);
                            setWebsiteModal(false);
                        }
                    } }) }), (0, jsx_runtime_1.jsx)(Modal, { isOpen: youtubeModal, onClose: () => setYoutubeModal(false), title: "Add YouTube URL", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Enter YouTube URL", className: "w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600", onKeyDown: (e) => {
                        if (e.key === 'Enter') {
                            setYoutubeUrls([...youtubeUrls, e.target.value]);
                            setYoutubeModal(false);
                        }
                    } }) }), (0, jsx_runtime_1.jsxs)("div", { className: `absolute w-[300px] left-0 bottom-[110%] w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${modelDropdown ? 'block' : 'hidden'}`, children: [(0, jsx_runtime_1.jsxs)("h4", { className: 'text-xs p-2 italic flex gap-1 items-center', children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Layers, { size: 18, className: 'text-black dark:text-white' }), "Choose a model"] }), modelDropdown && ((0, jsx_runtime_1.jsx)("div", { className: "rounded", children: Object.keys(modelsMap).map((key) => ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("div", { className: `flex justify-between p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${openKey === key ? 'bg-gray-100 dark:bg-zinc-700' : ''}`, onClick: () => handleToggle(key), children: [(0, jsx_runtime_1.jsx)("p", { className: 'text-sm', children: key }), (0, jsx_runtime_1.jsx)("span", { children: openKey === key ? '-' : '+' })] }), openKey === key && ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col", children: modelsMap[key].map((model, index) => ((0, jsx_runtime_1.jsxs)("div", { className: `flex gap-3 p-2 my-1 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${selectedModel === model.model ? 'bg-gray-100 dark:bg-zinc-700' : ''}`, onClick: () => {
                                            setSelectedModel(model.model);
                                            setModelDropdown(false);
                                        }, children: [model.icon === "text" ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Text, { size: 18, className: 'text-black dark:text-white' })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Image, { size: 18, className: 'text-black dark:text-white' })), (0, jsx_runtime_1.jsx)("p", { className: 'text-xs', children: model.model }), " "] }, index))) }))] }, key))) }))] })] }));
}
//# sourceMappingURL=InputChat.js.map