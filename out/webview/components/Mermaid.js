"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MermaidExample;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
// Track if Mermaid is already loaded
let mermaidLoaded = false;
const MermaidDiagram = ({ chart, id }) => {
    const mermaidRef = (0, react_1.useRef)(null);
    const [isScriptLoaded, setIsScriptLoaded] = (0, react_1.useState)(mermaidLoaded);
    (0, react_1.useEffect)(() => {
        const loadMermaid = async () => {
            if (!mermaidLoaded) {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
                    script.async = true;
                    script.onload = () => {
                        mermaidLoaded = true;
                        window.mermaid.initialize({
                            startOnLoad: false,
                            theme: 'default',
                            securityLevel: 'strict',
                        });
                        setIsScriptLoaded(true);
                        resolve();
                    };
                    document.body.appendChild(script);
                });
            }
            return Promise.resolve();
        };
        const renderDiagram = async () => {
            try {
                if (!mermaidLoaded) {
                    await loadMermaid();
                }
                if (window.mermaid && mermaidRef.current) {
                    const { svg } = await window.mermaid.render(`mermaid-${id}`, chart);
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                }
            }
            catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
            }
        };
        renderDiagram();
    }, [chart, id, isScriptLoaded]);
    return (0, jsx_runtime_1.jsx)("div", { ref: mermaidRef, className: "mermaid-diagram" });
};
function MermaidExample({ chart }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "rounded p-4 bg-transparent flex justify-center", children: (0, jsx_runtime_1.jsx)(MermaidDiagram, { chart: chart, id: crypto.randomUUID() }) }) }));
}
//# sourceMappingURL=Mermaid.js.map