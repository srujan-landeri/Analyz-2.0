import React, { useState } from 'react';
import { Image, Upload, Send, PlusIcon, ChevronUp, ChevronDown, BrainCircuit, Plus, Layers } from 'lucide-react';
import { FaMicrophone } from "react-icons/fa";
const { v4: uuidv4 } = require('uuid');

export default function Chat(props: any) {
    const [inputValue, setInputValue] = useState('');
    const [chatDropdown, setChatDropdown] = useState(false);
    const [modelDropdown, setModelDropdown] = useState(false);

    interface modelsMap {
        [key: string]: string[];
    }

    const modelsMap : modelsMap={
        "ollama": ['deepseek-coder-v2:16b', 'codestral:22b', 'gemma2:9b', "mistral:latest"],
        "groq": ["llama3-groq-70b-8192-tool-use-preview", "llama-3.1-70b-versatile", "llama-3.2-11b-vision-preview"]
    }
    
    const [selectedModel, setSelectedModel] = useState('mistral:latest');
    const [openKey, setOpenKey] = useState(null); // State for the open accordion

    const vscode = props.vscode;
    const disabled = props.disabled;

    const handleToggle = (key: any) => {
        setOpenKey(openKey === key ? null : key); // Toggle open/close for the selected key
    };

    const handleSendMessage = () => {
        if (inputValue === '') return
        if (disabled) return

        const newMessage = {
            icon: 'user',
            message: inputValue,
            model: selectedModel,
            id: uuidv4(),
        };
        props.addMessage(newMessage);
        vscode.postMessage({
            type: 'new-message',
            value: inputValue,
        });
        setInputValue('');
        
        const input = document.getElementById('chat-input') as HTMLTextAreaElement;
        input.style.height = `30px`;
        
    };


    function handleVoiceInput() {
        vscode.postMessage({
            type: 'alert',
            value: 'Voice input is not supported yet.',
        });
    }
    return (
        <div className="flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto
                     bg-white shadow-lg 
                     text-black dark:text-white dark:bg-zinc-800">

            {/* Chat options */}
            <div className='flex items-center justify-between mb-2'>
                <div>
                    <button className="p-1">
                        <PlusIcon
                            size={14}
                            className="text-black dark:text-zinc-300 hover:rotate-45 duration-100"
                            onClick={() => {
                                setChatDropdown(!chatDropdown)
                                setModelDropdown(false)
                            }}
                        />
                    </button>

                    <button className="p-1">
                        {modelDropdown ? <ChevronDown
                            size={14}
                            className="text-black dark:text-zinc-300"
                            onClick={() => {
                                setChatDropdown(false)
                                setModelDropdown(!modelDropdown)
                            }}
                        /> : <ChevronUp
                            size={14}
                            className="text-black dark:text-zinc-300"
                            onClick={() => {
                                setChatDropdown(false)
                                setModelDropdown(!modelDropdown)
                            }}
                        />}
                    </button>
                </div>
                <p className='text-[0.7rem] text-gray-500 dark:text-gray-400 text-right'>
                    In Use <span className="font-semibold text-[0.8rem] text-gray-700 dark:text-gray-300">
                        {selectedModel}
                    </span>
                </p>
            </div>

            {/* Chat Input */}
            <div className='flex items-start'>
                <textarea
                    id='chat-input'
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    className="flex-1 bg-transparent resize-none overflow-y-auto focus:outline-none px-2 custom-scrollbar"
                    placeholder="Ask me anything..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    rows={1} // Initial row
                    style={{ height: 'auto', maxHeight: '200px', scrollbarWidth: "thin", scrollbarColor: "white" }} // Inline height control
                />
                <button className="p-1" onClick={handleVoiceInput}>
                    <FaMicrophone size={18} className="text-black dark:text-white" />
                </button>
                <button className="p-1" onClick={handleSendMessage}>
                    <Send size={18} className="text-black dark:text-white" />
                </button>
            </div>

            {/* Chat Dropdown */}

            <div className={`absolute left-0 bottom-20 w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${chatDropdown ? 'block' : 'hidden'}`}>

                <div className='flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700'>
                    <Upload size={18} className='text-black dark:text-white' />
                    <p className='text-xs'>Upload file</p>
                </div>

                <div className='flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700'>
                    <Image size={18} className='text-black dark:text-white' />
                    <p className='text-xs'>Attach image</p>
                </div>

            </div>

            { /* Model Dropdown */}

            <div className={`absolute w-[300px] left-0 bottom-[110%] w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${modelDropdown ? 'block' : 'hidden'}`}>
                <h4 className='text-xs p-2 italic flex gap-1 items-center'>
                    <Layers size={18} className='text-black dark:text-white' />
                    Choose a model
                </h4>

                 {modelDropdown && (
                <div className="rounded">
                    {Object.keys(modelsMap).map((key) => (
                        <div key={key}>
                            <div
                                className={`flex justify-between p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${openKey === key ? 'bg-gray-100 dark:bg-zinc-700' : ''}`}
                                onClick={() => handleToggle(key)}
                            >
                                <p className='text-sm'>{key}</p>
                                {/* Add a toggle icon (optional) */}
                                <span>{openKey === key ? '-' : '+'}</span>
                            </div>
                            
                            {openKey === key && (
                                <div className="flex flex-col">
                                    {modelsMap[key].map((model:string, index:number) => (
                                        <div key={index} className={`flex gap-3 p-2 my-1 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${selectedModel === model ? 'bg-gray-100 dark:bg-zinc-700' : ''}`}
                                            onClick={() => {
                                                setSelectedModel(model);
                                                setModelDropdown(false);
                                            }}>
                                            <BrainCircuit size={18} className='text-black dark:text-white' />
                                            <p className='text-xs'>{model}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            </div>
        </div>
    );
}