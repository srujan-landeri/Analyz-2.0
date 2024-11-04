"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MermaidExample;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
let mermaidLoaded = false;
const MermaidDiagram = ({ chart, id }) => {
    const mermaidRef = (0, react_1.useRef)(null);
    const [isScriptLoaded, setIsScriptLoaded] = (0, react_1.useState)(mermaidLoaded);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadMermaid = async () => {
            if (!mermaidLoaded) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
                    script.async = true;
                    script.onload = () => {
                        try {
                            mermaidLoaded = true;
                            window.mermaid.initialize({
                                startOnLoad: false,
                                theme: 'default',
                                securityLevel: 'strict',
                                useMaxWidth: true,
                                worker: false // Disable Web Worker
                            });
                            setIsScriptLoaded(true);
                            resolve();
                        }
                        catch (err) {
                            reject(err);
                        }
                    };
                    script.onerror = (e) => {
                        reject(new Error('Failed to load Mermaid script'));
                    };
                    document.body.appendChild(script);
                });
            }
            return Promise.resolve();
        };
        const renderDiagram = async () => {
            try {
                setError(null);
                if (!mermaidLoaded) {
                    await loadMermaid();
                }
                if (window.mermaid && mermaidRef.current) {
                    const uniqueId = `mermaid-${id}-${Date.now()}`;
                    const { svg } = await window.mermaid.render(uniqueId, chart);
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg;
                    }
                }
            }
            catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
                setError(error instanceof Error ? error.message : 'Failed to render diagram');
            }
        };
        renderDiagram();
    }, [chart, id, isScriptLoaded]);
    if (error) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "text-red-500 p-4 border border-red-300 rounded", children: ["Error rendering diagram: ", error] }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { ref: mermaidRef, className: "mermaid-diagram w-full overflow-x-auto" }));
};
function MermaidExample({ chart }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "rounded p-4 bg-transparent flex justify-center", children: (0, jsx_runtime_1.jsx)(MermaidDiagram, { chart: chart, id: crypto.randomUUID() }) }) }));
}
//# sourceMappingURL=Mermaid.js.map