import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
    chart: string;
    id: string; // Add id prop to handle multiple instances
}

declare global {
    interface Window {
        mermaid: {
            initialize: (config: {
                startOnLoad: boolean;
                theme: string;
                securityLevel?: string;
            }) => void;
            render: (
                id: string,
                text: string
            ) => Promise<{ svg: string }>;
        };
    }
}

// Track if Mermaid is already loaded
let mermaidLoaded = false;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(mermaidLoaded);

    useEffect(() => {
        const loadMermaid = async () => {
            if (!mermaidLoaded) {
                return new Promise<void>((resolve) => {
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
            } catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
            }
        };

        renderDiagram();
    }, [chart, id, isScriptLoaded]);

    return <div ref={mermaidRef} className="mermaid-diagram" />;
};

export default function MermaidExample({ chart }: { chart: string }) {
    return (
        <div className="p-4">
            <div className="rounded p-4 bg-transparent flex justify-center">
                <MermaidDiagram chart={chart} id={crypto.randomUUID()} />
            </div>
        </div>
    );
}