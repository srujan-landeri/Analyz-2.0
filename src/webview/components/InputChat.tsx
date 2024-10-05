import React, { useState } from 'react';
import { Image, Upload, Send, PlusIcon, ChevronUp, ChevronDown, BrainCircuit, Plus } from 'lucide-react';
import { FaMicrophone } from "react-icons/fa";
const { v4: uuidv4 } = require('uuid');

export default function Chat(props: any) {
    const [inputValue, setInputValue] = useState('');
    const [chatDropdown, setChatDropdown] = useState(false);
    const [modelDropdown, setModelDropdown] = useState(false);

    const models = ['deepseek-coder-v2:16b', 'codestral:22b', 'gemma2:9b', "mistral:latest"];
    const [selectedModel, setSelectedModel] = useState('mistral:latest');

    const vscode = props.vscode;
    const disabled = props.disabled;

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
        
        // set the height of the input back to 1 row
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
                <p className='text-[0.7rem] mr-2 text-black dark:text-zinc-400'>
                    In Use:
                    <span className='text-[0.8rem] ml-1 text-black dark:text-white'>
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

            <div className={`absolute w-[300px] left-0 bottom-20 w-40 bg-white dark:bg-zinc-800 rounded-sm shadow-lg ${modelDropdown ? 'block' : 'hidden'}`}>
                <h4 className='text-xs p-2'>
                    Choose a model
                </h4>

                {
                    models.map((model, index) => (
                        <div key={index} className={`flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${selectedModel === model ? 'bg-gray-100 dark:bg-zinc-700' : ''}`}
                            onClick={() => {
                                setSelectedModel(model);
                                setModelDropdown(false);
                            }}>
                            <BrainCircuit size={18} className='text-black dark:text-white' />
                            <p className='text-xs'>{model}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}