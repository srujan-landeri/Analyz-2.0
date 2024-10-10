import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeConverter() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  
  const languages = [
    "javascript", "python", "java", "cpp", "ruby", 
    "go", "swift", "rust", "php", "typescript"
  ];

  const handleEditorChange = (value:any, event:any) => {
    setSourceCode(value);
  };

  const handleConvertClick = () => {
    // Placeholder for conversion logic
    setConvertedCode(sourceCode);
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    automaticLayout: true,
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Code Converter
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Transform your code between programming languages seamlessly
            </p>
          </div>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        {/* Language Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <select className={`w-full p-2 rounded-md border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select className={`w-full p-2 rounded-md border ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Code Editors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Source Code</label>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme={isDarkMode ? "vs-dark" : "light"}
                onChange={handleEditorChange}
                options={editorOptions}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Converted Code</label>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-700">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={convertedCode}
                theme={isDarkMode ? "vs-dark" : "light"}
                options={{
                  ...editorOptions,
                  readOnly: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <button 
          onClick={handleConvertClick}
          className={`w-full py-3 rounded-md font-medium transition-colors ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Convert Code
        </button>
      </div>
    </div>
  );
}