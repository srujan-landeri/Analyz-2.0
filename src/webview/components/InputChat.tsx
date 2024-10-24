import React, { useState } from 'react';
import {
    Image, X, ImageIcon, Upload, Send, PlusIcon,
    ChevronUp, ChevronDown, Globe, Search, Link,
    Text,
    Layers
} from 'lucide-react';
import { FaMicrophone, FaYoutube } from "react-icons/fa";
const { v4: uuidv4 } = require('uuid');

export default function Chat(props: any) {
    const [inputValue, setInputValue] = useState('');
    const [chatDropdown, setChatDropdown] = useState(false);
    const [modelDropdown, setModelDropdown] = useState(false);

    interface Model {
        icon: string;
        model: string;
    }

    interface ModelsMap {
        [key: string]: Model[];
    }

    const modelsMap: ModelsMap = {
        ollama: [{ icon: 'text', model: 'deepseek-coder-v2:16b' }, { icon: 'text', model: 'codestral:22b' }, { icon: 'text', model: 'gemma2:9b' }, { icon: 'text', model: 'mistral:latest' }],
        groq: [{ icon: 'text', model: 'llama3-groq-70b-8192-tool-use-preview' }, { icon: 'text', model: 'llama-3.1-70b-versatile' }, { icon: 'image', model: 'llama-3.2-11b-vision-preview' }],
    };

    const [selectedSource, setSelectedSource] = useState(props.llm.name);
    const [selectedModel, setSelectedModel] = useState(props.llm.model);
    const [openKey, setOpenKey] = useState(null); // State for the open accordion

    // Add these to your existing state declarations
    const [fileModal, setFileModal] = useState<any>(false);
    const [websiteModal, setWebsiteModal] = useState<any>(false);
    const [youtubeModal, setYoutubeModal] = useState<any>(false);

    // Add these to your existing state declarations
    const [pastedImage, setPastedImage] = useState<string | null>(null); // State for pasted image
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [websites, setWebsites] = useState<any>([]);
    const [youtubeUrls, setYoutubeUrls] = useState<any>([]);


    const vscode = props.vscode;
    const disabled = props.disabled;

    const handleToggle = (key: any) => {
        setSelectedSource(key.toLowerCase());
        setOpenKey(openKey === key ? null : key);
    };

    const handleSendMessage = () => {
        if (inputValue === '' || disabled) return;

        // Build references object
        let references: { [key: string]: any } | null = {};

        // Add encoded image if it exists
        if (pastedImage) {
            references = { ...references, image: pastedImage };
        }

        // Add websites if any exist
        if (websites.length > 0) {
            references = { ...references, websites: websites }; 
        }

        // Add YouTube references if they exist
        if (youtubeUrls.length > 0) {
            references = { ...references, youtube: youtubeUrls };
        }

        // If references object exists, convert it to a string; otherwise, set referencesString to null
        if(Object.keys(references).length === 0) {
            references = null;
        }

        const referencesString = references ? JSON.stringify(references) : null;

        // Construct the new message object
        const newMessage = {
            icon: 'user',
            message: inputValue,
            model: {
                name: selectedModel,
                source: selectedSource,
            },
            id: uuidv4(),
            references: referencesString
        };
        console.log("Adding Message", newMessage)
        props.addMessage(newMessage);
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


    interface ModalProps {
        title: string;
        children: React.ReactNode;
        isOpen: boolean;
        onClose: () => void;
    }

    // Modal Component
    const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 w-96">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button onClick={onClose} className="p-1">
                            <X size={18} className="text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                    {children}
                </div>
            </div>
        );
    };

    interface ResourceChipProps {
        icon: any;
        label: string;
        count?: number;
        onRemove: () => void;
    }

    const ResourceChip = ({ icon: Icon, label, count, onRemove }: ResourceChipProps) => (
        <div className="relative flex items-center">
            <div className="flex items-center px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md">
                <Icon size={14} className="text-black dark:text-zinc-300 mr-1" />
                <span className="text-xs text-gray-600 dark:text-zinc-400">
                    {label} {count && count > 1 && `(${count})`}
                </span>
                <button
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full p-1 transition-all"
                    onClick={onRemove}
                >
                    <X size={12} className="text-gray-500 dark:text-zinc-400" />
                </button>
            </div>
        </div>
    );

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;

        // Loop through clipboard items
        console.log(items)
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                const file = item.getAsFile();

                if (file) {
                    const reader = new FileReader();

                    reader.onload = (event) => {
                        if (event.target && typeof event.target.result === 'string') {
                            setPastedImage(event.target.result); // Set the pasted image as base64
                            console.log(event.target.result);
                        }
                    };

                    reader.readAsDataURL(file); // Read the image file as a data URL
                }
                break; // Only allow one image to be pasted
            }
        }
    };

    return (
        <div className="flex flex-col fixed left-[2.5%] right-[2.5%] bottom-3 w-[95%] rounded-lg p-2 mx-auto bg-white shadow-lg text-black dark:text-white dark:bg-zinc-800">

            {/* Chat options */}
            <div className='flex items-center justify-between mb-2'>
                <div className='flex gap-2'>

                    <div className='flex items-center space-x-2'>
                        <div>
                            <button
                                className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                onClick={() => {
                                    setChatDropdown(!chatDropdown)
                                    setModelDropdown(false)
                                }}
                            >
                                <PlusIcon
                                    size={14}
                                    className="text-black dark:text-zinc-300 hover:rotate-45 transition-transform duration-200"
                                />
                            </button>

                            <button
                                className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                onClick={() => {
                                    setChatDropdown(false)
                                    setModelDropdown(!modelDropdown)
                                }}
                            >
                                {modelDropdown ? (
                                    <ChevronDown size={14} className="text-black dark:text-zinc-300" />
                                ) : (
                                    <ChevronUp size={14} className="text-black dark:text-zinc-300" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {pastedImage && (
                            <ResourceChip
                                icon={ImageIcon}
                                label="Image"
                                onRemove={() => setPastedImage(null)}
                            />
                        )}
                        {uploadedFile && (
                            <ResourceChip
                                icon={Upload}
                                label="File"
                                onRemove={() => setUploadedFile(null)}
                            />
                        )}
                        {websites.length > 0 && (
                            <ResourceChip
                                icon={Globe}
                                label="Websites"
                                count={websites.length}
                                onRemove={() => setWebsites([])}
                            />
                        )}
                        {youtubeUrls.length > 0 && (
                            <ResourceChip
                                icon={FaYoutube}
                                label="YouTube"
                                count={youtubeUrls.length}
                                onRemove={() => setYoutubeUrls([])}
                            />
                        )}
                    </div>
                </div>


                <div className='flex items-center'>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        In Use{' '}
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                            {selectedSource} : {selectedModel}
                        </span>
                    </p>
                </div>
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
                    onPaste={handlePaste} // Handle image paste
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
                <div
                    className='flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700'
                    onClick={() => {
                        setFileModal(true);
                        setChatDropdown(false);
                    }}
                >
                    <Upload size={18} className='text-black dark:text-white' />
                    <p className='text-xs'>Upload file</p>
                </div>

                <div
                    className='flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700'
                    onClick={() => {
                        setWebsiteModal(true);
                        setChatDropdown(false);
                    }}
                >
                    <Globe size={18} className='text-black dark:text-white' />
                    <p className='text-xs'>Scrape Website</p>
                </div>

                <div
                    className='flex gap-3 p-2 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700'
                    onClick={() => {
                        setYoutubeModal(true);
                        setChatDropdown(false);
                    }}
                >
                    <FaYoutube size={18} className='text-black dark:text-white' />
                    <p className='text-xs'>Youtube URL</p>
                </div>
            </div>

            {/* Add these modal components at the end of your return statement */}
            <Modal
                isOpen={fileModal}
                onClose={() => setFileModal(false)}
                title="Upload File"
            >
                <div className="relative flex items-center w-full">
                    <input
                        type="file"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                setUploadedFile(e.target.files[0]);
                                setFileModal(false);
                            }
                        }}
                        className="sr-only"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex items-center justify-between w-full p-2 bg-gray-100 dark:bg-zinc-700 rounded-md cursor-pointer border border-gray-200 dark:border-zinc-600 hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                    >
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex-grow text-center">
                            {uploadedFile ? uploadedFile.name : "No file chosen"}
                        </span>
                        <Upload
                            size={18}
                            className="text-gray-500 dark:text-gray-400 ml-2"
                        />
                    </label>
                </div>
            </Modal>

            <Modal
                isOpen={websiteModal}
                onClose={() => setWebsiteModal(false)}
                title="Add Website URL"
            >
                <input
                    type="text"
                    placeholder="Enter website URL"
                    className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            setWebsites([...websites, e.target.value]);
                            setWebsiteModal(false);
                        }
                    }}
                />
            </Modal>

            <Modal
                isOpen={youtubeModal}
                onClose={() => setYoutubeModal(false)}
                title="Add YouTube URL"
            >
                <input
                    type="text"
                    placeholder="Enter YouTube URL"
                    className="w-full p-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600"
                    onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                            setYoutubeUrls([...youtubeUrls, e.target.value]);
                            setYoutubeModal(false);
                        }
                    }}
                />
            </Modal>

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
                                        {modelsMap[key].map((model: Model, index: number) => (
                                            <div key={index} className={`flex gap-3 p-2 my-1 items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 ${selectedModel === model.model ? 'bg-gray-100 dark:bg-zinc-700' : ''}`}
                                                onClick={() => {
                                                    setSelectedModel(model.model);
                                                    setModelDropdown(false);
                                                }}>
                                                {model.icon === "text" ? (
                                                    <Text size={18} className='text-black dark:text-white' />
                                                ) : (
                                                    <Image size={18} className='text-black dark:text-white' />
                                                )}
                                                <p className='text-xs'>{model.model}</p> {/* Assuming 'name' is a property */}
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