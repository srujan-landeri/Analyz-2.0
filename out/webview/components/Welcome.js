"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = WelcomeScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const lucide_react_1 = require("lucide-react");
function WelcomeScreen() {
    const features = [
        { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "w-5 h-5" }), text: "Search Websites" },
        { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Globe, { className: "w-5 h-5" }), text: "Search The Web" },
        { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "w-5 h-5" }), text: "Search Research Papers" },
        { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Image, { className: "w-5 h-5" }), text: "Interpret Images" },
        { icon: (0, jsx_runtime_1.jsx)(lucide_react_1.Layers, { className: "w-5 h-5" }), text: "Access to Multiple Models" }
    ];
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center justify-center min-h-[400px] p-8 space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "w-6 h-6 bg-white rounded-full" }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "text-center space-y-2", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold text-gray-800 dark:text-gray-100", children: "Welcome to Analyz" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 dark:text-gray-300", children: "Your AI-powered research assistant" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-md", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-sm font-medium text-gray-500 dark:text-gray-400 mb-4", children: "I can help you with:" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 gap-4", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-blue-500 dark:text-blue-400", children: feature.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-700 dark:text-gray-300", children: feature.text })] }, index))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "mt-8", children: (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Type your question or request to get started" }) })] }));
}
//# sourceMappingURL=Welcome.js.map