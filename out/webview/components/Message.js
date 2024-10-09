"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logo = Logo;
exports.default = Message;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MoonLoader_1 = __importDefault(require("react-spinners/MoonLoader"));
const Markdown_1 = __importDefault(require("./Markdown"));
function Logo() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-white rounded-full" }) }) }));
}
function Message(props) {
    const { icon, theme, vscode, user, animate, message } = props;
    const [loadingText, setLoadingText] = (0, react_1.useState)("Typing...");
    const imageSrc = user?.picture;
    const name = user?.name;
    const loadingTexts = ["Parsing", "Interpreting", "Generating", "Loading"];
    (0, react_1.useEffect)(() => {
        if (animate) {
            let i = 0;
            const interval = setInterval(() => {
                setLoadingText(`${loadingTexts[i % 4]}...`);
                i++;
            }, 1000); // Update every second
            return () => clearInterval(interval); // Cleanup on component unmount
        }
    }, [animate]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: icon === 'chatbot' ? ((0, jsx_runtime_1.jsx)(Logo, {})) : ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 overflow-hidden rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: imageSrc, alt: "user", className: 'w-full h-full object-cover' }) })) }), (0, jsx_runtime_1.jsx)("span", { className: 'ml-3 font-medium text-sm text-gray-700 dark:text-gray-300', children: icon === 'chatbot' ? 'Analyz' : name })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-normal rounded-md text-black dark:text-white apply-my-2`, children: animate ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center my-5", children: [(0, jsx_runtime_1.jsx)(MoonLoader_1.default, { color: theme === 'dark' ? '#fff' : '#000', loading: animate, size: 20, "aria-label": "Loading Spinner", "data-testid": "loader" }), (0, jsx_runtime_1.jsx)("p", { className: "ml-3 text-gray-500 dark:text-gray-400", children: loadingText })] })) : ((0, jsx_runtime_1.jsx)(Markdown_1.default, { vscode: vscode, theme: theme, message: message })) })] }));
}
//# sourceMappingURL=Message.js.map