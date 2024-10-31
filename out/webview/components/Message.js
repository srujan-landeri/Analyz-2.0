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
const lucide_react_1 = require("lucide-react");
const fa_1 = require("react-icons/fa");
const Markdown_1 = __importDefault(require("./Markdown"));
function Logo() {
    return ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-4 h-4 bg-white rounded-full" }) }) }));
}
function parseReferencesString(str) {
    try {
        // Convert the string to valid JSON format
        console.log("Parsing references string", str);
        str = str.replace(/'/g, '"');
        return JSON.parse(str);
    }
    catch (error) {
        return [];
    }
}
function ReferenceTabs({ referencesString }) {
    if (!referencesString)
        return null;
    const references = parseReferencesString(referencesString);
    console.log("References to be rendered", references);
    if (references.length === 0)
        return null;
    const getTabs = () => {
        const tabs = [];
        Object.keys(references).forEach((key) => {
            if (key === 'image') {
                tabs.push({ icon: lucide_react_1.Image, text: 'Image' });
            }
            else if (key === 'youtube') {
                const youtubeCount = references[key].length;
                tabs.push({ icon: fa_1.FaYoutube, text: 'YouTube', count: youtubeCount > 1 ? youtubeCount : null });
            }
            else if (key === 'websites') {
                const websitesCount = references[key].length;
                tabs.push({
                    icon: lucide_react_1.Globe,
                    text: 'Websites',
                    count: websitesCount > 1 ? websitesCount : null
                });
            }
        });
        console.log("Tabs to be rendered", tabs);
        return tabs;
    };
    const tabs = getTabs();
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap my-2 items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: 'text-xs font-medium text-gray-700 dark:text-gray-300', children: "References:" }), (0, jsx_runtime_1.jsx)("div", { className: 'flex gap-2', children: tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 text-xs mt-1 text-gray-700 dark:text-gray-300", children: [(0, jsx_runtime_1.jsx)(Icon, { className: "w-4 h-4 mr-1" }), (0, jsx_runtime_1.jsx)("span", { children: tab.text }), tab.count && (0, jsx_runtime_1.jsxs)("span", { className: "ml-1", children: ["(", tab.count, ")"] })] }, index));
                }) })] }));
}
function Message(props) {
    const { icon, theme, vscode, user, animate, message, references } = props;
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
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [animate]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col w-full animate-fade-in", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center justify-center", children: icon === 'chatbot' ? ((0, jsx_runtime_1.jsx)(Logo, {})) : ((0, jsx_runtime_1.jsx)("div", { className: "w-8 h-8 overflow-hidden rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("img", { src: imageSrc, alt: "user", className: "w-full h-full object-cover" }) })) }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 font-medium text-sm text-gray-700 dark:text-gray-300", children: icon === 'chatbot' ? 'Analyz' : name })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-normal rounded-md text-black dark:text-white mt-4`, children: animate ? ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center my-5", children: [(0, jsx_runtime_1.jsx)(MoonLoader_1.default, { color: theme === 'dark' ? '#fff' : '#000', loading: animate, size: 20, "aria-label": "Loading Spinner", "data-testid": "loader" }), (0, jsx_runtime_1.jsx)("p", { className: "ml-3 text-gray-500 dark:text-gray-400", children: loadingText })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Markdown_1.default, { vscode: vscode, theme: theme, message: message }), references && references != message && (0, jsx_runtime_1.jsx)(ReferenceTabs, { referencesString: references })] })) })] }));
}
//# sourceMappingURL=Message.js.map