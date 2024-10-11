import React, { useEffect, useRef } from 'react';

interface MermaidDiagramProps {
    chart: string;
}

// Properly declare mermaid types
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

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
            } catch (error) {
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

    return <div ref={mermaidRef} />;
};

export default function MermaidExample({chart} : {chart: string}) {

    return (
        <div className="p-4">
            <div className="rounded p-4 bg-transparent flex justify-center">
                <MermaidDiagram chart={chart} />
            </div>
        </div>
    );
}