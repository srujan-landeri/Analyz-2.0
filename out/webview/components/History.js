"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = History;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const react_spinners_1 = require("react-spinners");
const { v4: uuidv4 } = require('uuid');
const react_toastify_1 = require("react-toastify");
function History(props) {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [history, setHistory] = (0, react_1.useState)([]);
    const token = props.token;
    const filteredHistory = history.filter(chat => chat.run_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:8000/user/chat_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: token
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }
            const data = await response.json();
            console.log(data);
            setHistory(data);
            setLoading(false);
        }
        catch (error) {
            console.error('Error fetching chats:', error);
            setLoading(false); // Stop loading if there's an error
        }
    };
    (0, react_1.useEffect)(() => {
        if (token) {
            fetchChats();
        }
    }, [token]);
    function openChat(chat) {
        const run_id = chat.run_id;
        const run_name = chat.run_name;
        const llm = chat.llm;
        llm.model = llm.model.toLowerCase();
        llm.name = llm.name.toLowerCase();
        const chat_history = chat.chat_history;
        const llm_chats = chat.llm_messages.filter((msg) => msg.role === 'user');
        const updatedChats = chat_history.map((chat, ind) => {
            return {
                id: uuidv4(),
                icon: chat.role === 'user' ? 'user' : 'chatbot',
                message: chat.content,
                references: chat.role === 'user' ? llm_chats[ind / 2].content.split('\n')[0].replace("References :", "") : null
            };
        });
        props.setChat({
            run_id: run_id,
            run_name: run_name,
            llm: llm,
            chat_history: updatedChats,
        });
        props.setPage('chat');
    }
    async function handleDelete(run_id) {
        try {
            const response = await fetch("http://localhost:8000/run/" + run_id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                // If response is not OK, throw an error
                const errorData = await response.json();
                throw new Error(`Error: ${response.status}, ${errorData.detail}`);
            }
            const result = await response.json();
            fetchChats();
            react_toastify_1.toast.success('Chat deleted successfully!');
            return result;
        }
        catch (error) {
            console.error('Error deleting run:', error);
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col h-screen w-full p-2 text-gray-700 dark:text-gray-300", children: [loading && ((0, jsx_runtime_1.jsx)("div", { className: 'flex flex-col justify-center items-center h-[85vh] mt-5', children: (0, jsx_runtime_1.jsx)(react_spinners_1.BounceLoader, { color: props.theme === 'dark' ? '#fff' : '#000', size: 45, "aria-label": "Loading Spinner", "data-testid": "loader" }) })), !loading &&
                (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("button", { className: "p-2 pl-0 rounded-full transition-colors", onClick: () => props.setPage('chat'), children: (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { size: 15 }) }), (0, jsx_runtime_1.jsx)("h1", { className: "text-[13px]", children: "All Chats" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative mt-3 mb-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2", size: 15 }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search chats...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border bg-transparent text-zinc-800 dark:text-gray-300 border-zinc-800 dark:borer-white rounded-md focus:outline-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 overflow-y-auto mx-auto w-full my-2", children: [filteredHistory.map((chat) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between px-1 py-2 pl-3 w-full hover:bg-white/5 cursor-pointer rounded-lg transition-colors", children: [(0, jsx_runtime_1.jsxs)("div", { className: 'flex items-center', onClick: () => openChat(chat), children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-shrink-0", children: (0, jsx_runtime_1.jsx)(lucide_react_1.MessageSquare, { size: 20, className: "" }) }), (0, jsx_runtime_1.jsx)("div", { className: "ml-2 flex-1", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-[13px]", children: chat.run_name.replace(/^"|"$/g, '').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') }) })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Trash2, { size: 20, onClick: () => handleDelete(chat.run_id), className: 'cursor-pointer ' })] }, chat.run_id))), filteredHistory.length === 0 && ((0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center h-48", children: (0, jsx_runtime_1.jsx)("p", { className: "text-[13px] text-gray-400", children: "No chats found" }) }))] })] })] }));
}
//# sourceMappingURL=History.js.map