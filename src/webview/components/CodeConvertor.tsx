import React, { useState } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { ArrowLeft, Copy } from 'lucide-react';
import Markdown from './Markdown';

export default function CodeConverter(props: any) {
    const [sourceCode, setSourceCode] = useState<string>('');
    const [convertedCode, setConvertedCode] = useState<string>("");
    const [sourceLanguage, setSourceLanguage] = useState<string>("javascript");
    const [targetLanguage, setTargetLanguage] = useState<string>("python");

    const languages = [
        "javascript", "python", "java", "cpp", "ruby",
        "go", "swift", "rust", "php", "typescript"
    ];

    const handleEditorChange: OnChange = (value) => {
        setSourceCode(value || '');
    };

    const handleSourceLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSourceLanguage(event.target.value);
    };

    const handleTargetLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
                setConvertedCode(data.code || 'Conversion failed'
                );
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

    return (
        <div className="min-h-screen text-white">
            <div className="relative container mx-auto p-4 max-w-6xl">
                <ArrowLeft className="w-6 h-6 text-blue-500 cursor-pointer absolute right-1 top-1" onClick={() => props.setPage('chat')} />
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">
                        Code Converter
                    </h1>
                    <p className="text-gray-400">
                        Transform your code between programming languages seamlessly
                    </p>
                </div>

                {/* Language Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">From</label>
                        <select
                            className="w-full p-3 rounded bg-white text-gray-900"
                            value={sourceLanguage}
                            onChange={handleSourceLanguageChange}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">To</label>
                        <select
                            className="w-full p-3 rounded bg-white text-gray-900"
                            value={targetLanguage}
                            onChange={handleTargetLanguageChange}
                        >
                            {languages.map(lang => (
                                <option key={lang} value={lang}>
                                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Code Editors */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Source Code</label>
                        <div className="h-96 rounded bg-[#2C2C2C]">
                            <Editor
                                height="100%"
                                language={sourceLanguage}
                                onChange={handleEditorChange}
                                theme={props.theme==='dark' ? 'vs-dark' : 'light'}
                                options={editorOptions}
                                defaultValue=''
                                loading={
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        Loading editor...
                                    </div>
                                }
                                
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Converted Code</label>
                        <div className="relative h-96 rounded bg-[#2C2C2C]">
                            <Markdown
                                vscode={props.vscode}
                                theme={props.theme}
                                message={convertedCode}
                                height="384px"
                            />
                        </div>
                    </div>
                </div>

                {/* Convert Button */}
                <button
                    onClick={handleConvertClick}
                    className="w-full py-3 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white mt-6"
                >
                    Convert Code
                </button>
            </div>
        </div>
    );
}