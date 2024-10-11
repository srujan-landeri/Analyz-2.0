"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MermaidExample;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const MermaidDiagram = ({ chart }) => {
    const mermaidRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const renderDiagram = async () => {
            try {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
                script.async = true;
                script.onload = () => {
                    if (window.mermaid && mermaidRef.current) {
                        window.mermaid.initialize({
                            startOnLoad: false,
                            theme: 'default',
                            securityLevel: 'strict', // Added for extra security
                        });
                        // Clear previous content
                        mermaidRef.current.innerHTML = '';
                        // Render new diagram
                        window.mermaid.render('mermaid-diagram', chart).then((result) => {
                            if (mermaidRef.current) {
                                mermaidRef.current.innerHTML = result.svg;
                            }
                        });
                    }
                };
                document.body.appendChild(script);
            }
            catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
            }
        };
        renderDiagram();
        return () => {
            const script = document.querySelector('script[src*="mermaid"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [chart]);
    return (0, jsx_runtime_1.jsx)("div", { ref: mermaidRef });
};
function MermaidExample({ chart }) {
    return ((0, jsx_runtime_1.jsx)("div", { className: "p-4", children: (0, jsx_runtime_1.jsx)("div", { className: "rounded p-4 bg-transparent flex justify-center", children: (0, jsx_runtime_1.jsx)(MermaidDiagram, { chart: chart }) }) }));
}
//# sourceMappingURL=Mermaid.js.map