"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CodeConverter;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_2 = __importDefault(require("@monaco-editor/react"));
const lucide_react_1 = require("lucide-react");
const Markdown_1 = __importDefault(require("./Markdown"));
function CodeConverter(props) {
    const [sourceCode, setSourceCode] = (0, react_1.useState)('');
    const [convertedCode, setConvertedCode] = (0, react_1.useState)("");
    const [sourceLanguage, setSourceLanguage] = (0, react_1.useState)("javascript");
    const [targetLanguage, setTargetLanguage] = (0, react_1.useState)("python");
    const languages = [
        "javascript", "python", "java", "cpp", "ruby",
        "go", "swift", "rust", "php", "typescript"
    ];
    const handleEditorChange = (value) => {
        setSourceCode(value || '');
    };
    const handleSourceLanguageChange = (event) => {
        setSourceLanguage(event.target.value);
    };
    const handleTargetLanguageChange = (event) => {
        setTargetLanguage(event.target.value);
    };
    const handleConvertClick = () => {
        // Placeholder for conversion logic
        if (sourceLanguage === targetLanguage) {
            setConvertedCode(sourceCode);
            return;
        }
        // fetch to /assistant/completions/convert-code with text, source_language, target_language
        fetch('http://localhost:8000/assistant/completions/convert-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: sourceCode,
                source_language: sourceLanguage,
                target_language: targetLanguage,
            }),
        }).then(response => response.json())
            .then(data => {
            setConvertedCode(data.code || 'Conversion failed');
        })
            .catch((error) => {
            console.error('Error:', error);
        });
    };
    const editorOptions = {
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        automaticLayout: true,
        padding: { top: 16 },
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen text-white", children: (0, jsx_runtime_1.jsxs)("div", { className: "relative container mx-auto p-4 max-w-6xl", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ArrowLeft, { className: "w-6 h-6 text-blue-500 cursor-pointer absolute right-1 top-1", onClick: () => props.setPage('chat') }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold mb-2", children: "Code Converter" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-400", children: "Transform your code between programming languages seamlessly" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "From" }), (0, jsx_runtime_1.jsx)("select", { className: "w-full p-3 rounded bg-white text-gray-900", value: sourceLanguage, onChange: handleSourceLanguageChange, children: languages.map(lang => ((0, jsx_runtime_1.jsx)("option", { value: lang, children: lang.charAt(0).toUpperCase() + lang.slice(1) }, lang))) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "To" }), (0, jsx_runtime_1.jsx)("select", { className: "w-full p-3 rounded bg-white text-gray-900", value: targetLanguage, onChange: handleTargetLanguageChange, children: languages.map(lang => ((0, jsx_runtime_1.jsx)("option", { value: lang, children: lang.charAt(0).toUpperCase() + lang.slice(1) }, lang))) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Source Code" }), (0, jsx_runtime_1.jsx)("div", { className: "h-96 rounded bg-[#2C2C2C]", children: (0, jsx_runtime_1.jsx)(react_2.default, { height: "100%", language: sourceLanguage, onChange: handleEditorChange, theme: props.theme === 'dark' ? 'vs-dark' : 'light', options: editorOptions, defaultValue: '', loading: (0, jsx_runtime_1.jsx)("div", { className: "h-full w-full flex items-center justify-center text-gray-400", children: "Loading editor..." }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block text-sm font-medium mb-2", children: "Converted Code" }), (0, jsx_runtime_1.jsx)("div", { className: "relative h-96 rounded bg-[#2C2C2C]", children: (0, jsx_runtime_1.jsx)(Markdown_1.default, { vscode: props.vscode, theme: props.theme, message: convertedCode, height: "384px" }) })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleConvertClick, className: "w-full py-3 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white mt-6", children: "Convert Code" })] }) }));
}
//# sourceMappingURL=CodeConvertor.js.map