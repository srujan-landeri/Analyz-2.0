import React, { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
    chart: string;
    id: string;
}

declare global {
    interface Window {
        mermaid: {
            initialize: (config: {
                startOnLoad: boolean;
                theme: string;
                securityLevel?: string;
                useMaxWidth?: boolean;
                worker?: boolean;  // Add worker configuration option
            }) => void;
            render: (
                id: string,
                text: string
            ) => Promise<{ svg: string }>;
        };
    }
}

let mermaidLoaded = false;

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [isScriptLoaded, setIsScriptLoaded] = useState(mermaidLoaded);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMermaid = async () => {
            if (!mermaidLoaded) {
                return new Promise<void>((resolve, reject) => {
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
                                worker: false  // Disable Web Worker
                            });
                            setIsScriptLoaded(true);
                            resolve();
                        } catch (err) {
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
            } catch (error) {
                console.error('Error rendering Mermaid diagram:', error);
                setError(error instanceof Error ? error.message : 'Failed to render diagram');
            }
        };

        renderDiagram();
    }, [chart, id, isScriptLoaded]);

    if (error) {
        return (
            <div className="text-red-500 p-4 border border-red-300 rounded">
                Error rendering diagram: {error}
            </div>
        );
    }

    return (
        <div ref={mermaidRef} className="mermaid-diagram w-full overflow-x-auto" />
    );
};

export default function MermaidExample({ chart }: { chart: string }) {
    return (
        <div className="p-4">
            <div className="rounded p-4 bg-transparent flex justify-center">
                <MermaidDiagram 
                    chart={chart} 
                    id={crypto.randomUUID()} 
                />
            </div>
        </div>
    );
}