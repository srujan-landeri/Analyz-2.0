import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MessageSquare, DeleteIcon, Trash2 } from 'lucide-react';
import { BounceLoader } from 'react-spinners';

const { v4: uuidv4 } = require('uuid');

import { toast } from 'react-toastify';

interface LLMType {
    name: string;
    model: string;
}

interface ChatMessage {
    role: string;
    content: string;
    metrics: Record<string, unknown>;
    tool_call_error: boolean;
}

interface ChatHistory {
    run_id: string;
    run_name: string;
    llm: LLMType;
    chat_history: ChatMessage[];
    llm_messages: ChatMessage[];
}

export default function History(props: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<ChatHistory[]>([]);
    const token = props.token
    
    const filteredHistory = history.filter(chat =>
        chat.run_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:8000/user/chat_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: token
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chat history');
            }

            const data = await response.json();
            console.log(data);

            setHistory(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setLoading(false); // Stop loading if there's an error
        }
    };

    useEffect(() => {

        if (token) {
            fetchChats();
        }
    }, [token]);

    function openChat(chat: ChatHistory) {
        const run_id = chat.run_id;
        const run_name = chat.run_name;
        const llm = chat.llm;
        llm.model = llm.model.toLowerCase();
        llm.name = llm.name.toLowerCase();
        const chat_history = chat.chat_history;

        const llm_chats = chat.llm_messages.filter((msg: ChatMessage) => msg.role === 'user');

        const updatedChats = chat_history.map((chat: ChatMessage, ind: number) => {
            return {
                id: uuidv4(),
                icon: chat.role === 'user' ? 'user' : 'chatbot',
                message: chat.content,
                references: chat.role === 'user' ? llm_chats[ind/2].content.split('\n')[0].replace("References :", "") : null
            }
        });

        props.setChat({
            run_id: run_id,
            run_name: run_name,
            llm: llm,
            chat_history: updatedChats,
        });

        props.setPage('chat');
    }

    async function handleDelete(run_id: string) {
        try {
            const response = await fetch("http://localhost:8000/run/" + run_id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // If response is not OK, throw an error
                const errorData = await response.json();
                throw new Error(`Error: ${response.status}, ${errorData.detail}`);
            }

            const result = await response.json();
            fetchChats();
            toast.success('Chat deleted successfully!');
            return result;
        } catch (error) {
            console.error('Error deleting run:', error);
        }
    }

    return (
        <div className="flex flex-col h-screen w-full p-2 text-gray-700 dark:text-gray-300">

            {/* Header */}
            {
                loading && (
                    <div className='flex flex-col justify-center items-center h-[85vh] mt-5'>
                        <BounceLoader
                            color={props.theme === 'dark' ? '#fff' : '#000'}
                            size={45}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                )
            }
            {!loading &&
                <>
                    <div className="flex items-center">
                        <button
                            className="p-2 pl-0 rounded-full transition-colors"
                            onClick={() => props.setPage('chat')}
                        >
                            <ArrowLeft size={15} />
                        </button>
                        <h1 className="text-[13px]">All Chats</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mt-3 mb-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={15} />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border bg-transparent text-zinc-800 dark:text-gray-300 border-zinc-800 dark:borer-white rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Chat List */}
                    <div className="flex-1 overflow-y-auto mx-auto w-full my-2">

                        {filteredHistory.map((chat) => (
                                <div
                                    key={chat.run_id}
                                    className="flex items-center justify-between px-1 py-2 pl-3 w-full hover:bg-white/5 cursor-pointer rounded-lg transition-colors"
                                >
                                    <div className='flex items-center' onClick={() => openChat(chat)}>
                                        <div className="flex-shrink-0">
                                            <MessageSquare size={20} className="" />
                                        </div>
                                        <div className="ml-2 flex-1">
                                            <h2 className="text-[13px]">
                                                {/* // First Charactet of each word has to be capital rest should be small */}
                                                {
                                                    chat.run_name.replace(/^"|"$/g, '').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
                                                }
                                            </h2>
                                        </div>
                                    </div>
                                    <Trash2 size={20} onClick={() => handleDelete(chat.run_id)} className='cursor-pointer ' />
                                </div>
                        ))}

                        {
                            filteredHistory.length === 0 && (
                                <div className="flex items-center justify-center h-48">
                                    <p className="text-[13px] text-gray-400">No chats found</p>
                                </div>
                            )
                        }
                    </div>

                </>
            }
        </div>
    );
}