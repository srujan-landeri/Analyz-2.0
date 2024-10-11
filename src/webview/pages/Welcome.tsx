import React from 'react';
import { Search, Globe, FileText, Image, Layers, Code2 } from 'lucide-react';
import { FaQuestion, FaYoutube } from 'react-icons/fa';
import { FcFlowChart } from 'react-icons/fc';

export default function WelcomeScreen() {
    const features = [
        { icon: <Layers className="w-5 h-5" />, text: "Access to Multiple Models" },
        { icon: <Image className="w-5 h-5" />, text: "Analyse Images" },
        { icon: <FaQuestion className="w-5 h-5" />, text: "Answer Coding Questions" },
        { icon: <FaYoutube className="w-5 h-5" />, text: "Analyse Yotube Videos and Answer Queries" },
        { icon: <FcFlowChart className="w-5 h-5" />, text: "Generate Flowcharts and Explain better" },
        { icon: <Code2 className="w-5 h-5" />, text: "Convert Code Snippets Across Languages" },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">

            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome to Analyz
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Your AI-powered <span className="text-blue-600 dark:text-blue-400 font-bold">coding</span> assistant
                </p>

            </div>

            <div className="w-full max-w-md">
                <div className="grid grid-cols-1 gap-4">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            <div className="text-blue-500 dark:text-blue-400">
                                {feature.icon}
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Type your question to get started!
                </p>
            </div>
        </div>
    );
}